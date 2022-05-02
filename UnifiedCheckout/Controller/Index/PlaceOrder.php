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

class PlaceOrder extends \Magento\Framework\App\Action\Action
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
        $this->logger->debug("Place Order Constructor");
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
        $data = ["test" => "76437865sumit8734yri"];
        return $this->resultJsonFactory->create()->setData($data);
    }
}
