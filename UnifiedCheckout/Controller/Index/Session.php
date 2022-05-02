<?php
/**
 * Copyright © 2018 CyberSource. All rights reserved.
 * See accompanying LICENSE.txt for applicable terms of use and license.
 */

namespace CyberSource\UnifiedCheckout\Controller\Index;

use CyberSource\Core\Model\Logger;
use CyberSource\UnifiedCheckout\Gateway\Http\TransferFactory as HttpTransferFactory;
use CyberSource\UnifiedCheckout\Helper\RequestDataBuilder;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Exception\LocalizedException;
use Magento\Payment\Gateway\Http\TransferFactoryInterface;
use Magento\Setup\Module\Dependency\Report\BuilderInterface;

class Session extends \Magento\Framework\App\Action\Action
{

    /**
     * @var JsonFactory $resultJsonFactory
     */
    private $resultJsonFactory;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var RequestDataBuilder
     */
    private $requestDataBuilder;

    /**
     * @var string
     */
    private $exceptionMessage;

    /**
     * @var \Magento\Payment\Gateway\Validator\ValidatorInterface
     */
    private $validator;

    /**
     * Rest Client
     *
     * @var CyberSource\Core\Gateway\Http\Client\Rest
     */
    private $restClient;

    /**
     * @var HttpTransferFactory 
     */
    private $transferFactory;

    /**
     * LoadInfo constructor.
     *
     * @param Context $context
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Customer\Model\Session $customerSession
     * @param \Magento\Quote\Api\CartRepositoryInterface $cartRepository
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param JsonFactory $resultJsonFactory
     */
    public function __construct(
        Context $context,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Quote\Api\CartRepositoryInterface $cartRepository,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        TransferFactoryInterface $transferFactory,
        RequestDataBuilder $builder,
        \Magento\Payment\Gateway\Http\ClientInterface $client,
        \Magento\Payment\Gateway\Validator\ValidatorInterface $validator,
        $exceptionMessage,
        Logger $logger,
        JsonFactory $resultJsonFactory
    ) {
        $this->logger = $logger;
        $this->checkoutSession = $checkoutSession;
        $this->customerSession = $customerSession;
        $this->cartRepository = $cartRepository;
        $this->scopeConfig = $scopeConfig;
        $this->transferFactory = $transferFactory;
        $this->requestDataBuilder = $builder;
        $this->restClient = $client;
        $this->validator = $validator;
        $this->resultJsonFactory = $resultJsonFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        if(!empty($this->_request->getParam('guestEmail')))
            $guestEmail = $this->_request->getParam('guestEmail');
        else
        {
            throw new LocalizedException(__('Guest Email is Empty.'));
        }
        $quote = $this->checkoutSession->getQuote();

        $quote->collectTotals();
        $quote->reserveOrderId();
        $this->cartRepository->save($quote);

        if (! $quote->getCustomerId()) {
            $quote->setCustomerEmail($guestEmail);
            $quote->getBillingAddress()->setEmail($guestEmail);
        }

        $data = [];
        try {
            $request = $this->requestDataBuilder->buildSessionRequest();
            $this->logger->debug($request);
            $transfer0=$this->transferFactory->create($request);
            $clientResponse = $this->restClient->placeRequest($transfer0);
            $data['captureContext'] = $clientResponse;
        } catch (\CyberSource\Core\Gateway\Validator\NotFoundException $e) {
            // if no data found we return empty array
            return $this->resultJsonFactory->create()->setData($data);
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            throw new \Magento\Payment\Gateway\Command\CommandException(
                __($this->exceptionMessage),
                $e
            );
        }

        return $this->resultJsonFactory->create()->setData($data);
    }
}
