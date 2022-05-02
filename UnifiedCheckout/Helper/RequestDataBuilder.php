<?php
/**
 * Copyright © 2018 CyberSource. All rights reserved.
 * See accompanying LICENSE.txt for applicable terms of use and license.
 */

namespace CyberSource\UnifiedCheckout\Helper;

use CyberSource\Core\Helper\AbstractDataBuilder;
use Magento\Checkout\Helper\Data as CheckoutHelper;
use CyberSource\UnifiedCheckout\Gateway\Config\Config;
use Magento\Framework\Exception\LocalizedException;
use Magento\Quote\Model\Quote;
use Magento\Sales\Model\Order;
use stdClass;

class RequestDataBuilder extends AbstractDataBuilder
{
    const PAYMENT_TYPE = 'KLI';
    const SESSION_TYPE_UPDATE = 'U';
    const SESSION_TYPE_CREATE = 'N';
    const DEFAULT_BILL_TO_COUNTRY = 'US';
    const DEFAULT_BILL_TO_STATE = 'NY';
    const DEFAULT_BILL_TO_POSTCODE = '10001';
    const CAPTURE_TRANSACTION_ID =  'CaptureTransactionId';

    /**
     * @var Config
     */
    private $gatewayConfig;

    /**
     * @var \Magento\Quote\Api\CartRepositoryInterface
     */
    private $quoteRepository;

    /**
     * @var \Magento\Framework\Locale\Resolver
     */
    private $locale;

    /**
     * @var \Magento\Customer\Model\Address
     */
    private $address;

    /**
     * @var \Magento\Store\Model\Information
     */
    private $storeInformation;

    /**
     * @var \Magento\Directory\Model\RegionFactory
     */
    private $regionFactory;

    /**
     * @param \Magento\Framework\App\Helper\Context $context
     * @param \Magento\Customer\Model\Session $customerSession
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Store\Model\Information $storeInformation
     * @param \Magento\Directory\Model\RegionFactory $regionFactory
     * @param CheckoutHelper $checkoutHelper
     * @param Config $gatewayConfig
     * @param \Magento\Quote\Api\CartRepositoryInterface $quoteRepository
     * @param \Magento\Framework\Locale\Resolver $locale
     * @param \Magento\Sales\Model\ResourceModel\Order\CollectionFactory $orderCollectionFactory
     * @param \Magento\Sales\Model\ResourceModel\Order\Grid\CollectionFactory $orderGridCollectionFactory
     * @param \Magento\Backend\Model\Auth $auth
     * @param \Magento\GiftMessage\Model\Message $giftMessage
     * @param \Magento\Customer\Model\Address $address
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Store\Model\Information $storeInformation,
        \Magento\Directory\Model\RegionFactory $regionFactory,
        CheckoutHelper $checkoutHelper,
        Config $gatewayConfig,
        \Magento\Quote\Api\CartRepositoryInterface $quoteRepository,
        \Magento\Framework\Locale\Resolver $locale,
        \Magento\Sales\Model\ResourceModel\Order\CollectionFactory $orderCollectionFactory,
        \Magento\Sales\Model\ResourceModel\Order\Grid\CollectionFactory $orderGridCollectionFactory,
        \Magento\Backend\Model\Auth $auth,
        \Magento\GiftMessage\Model\Message $giftMessage,
        \Magento\Customer\Model\Address $address
    ) {
        parent::__construct(
            $context,
            $customerSession,
            $checkoutSession,
            $checkoutHelper,
            $orderCollectionFactory,
            $orderGridCollectionFactory,
            $auth,
            $giftMessage
        );
        $this->gatewayConfig = $gatewayConfig;
        $this->quoteRepository = $quoteRepository;
        $this->locale = $locale;
        $this->address = $address;
        $this->storeInformation = $storeInformation;
        $this->regionFactory = $regionFactory;
    }

    /**
     * @param bool $updateMode
     * @return array
     * @throws LocalizedException
     */
    public function buildSessionRequest($updateMode = false)
    {
        $quote = $this->checkoutSession->getQuote();
        $email = $quote->getCustomerEmail();
        $storeId = $quote->getStore()->getStoreId();
        $request = [];

        $targetOrigins[] = "https://127.0.0.1";
        $request['targetOrigins'] = $targetOrigins;
        $request['clientVersion'] = "0.6"; 

        $request['allowedCardNetworks'] = $this->getSupportedNetworks();
        $request['allowedPaymentTypes'] = ["PANENTRY","SRC"]; 
        $request['country'] = $quote->getBillingAddress()->getCountryId();
        $request['locale'] = $this->getLocale($storeId);

        $request['captureMandate'] = $this->buildCaptureMandate();
        
        $request['orderInformation'] = $this->buildOrderInformation($quote);

        return $request;
    }

    private function buildCaptureMandate(){
        return [
            'billingType' => "FULL", 
            'requestEmail' => true, 
            'requestPhone' => true, 
            'requestShipping' => true, 
            'shipToCountries' => [ "US", "GB" ],
            'showAcceptedNetworkIcons' => true
        ];
    }

    private function buildAddress(\Magento\Quote\Model\Quote\Address $address)
    {
        return [
            'firstName' => $address->getFirstname(),
            'lastName' => $address->getLastname(),
            'buildingNumber' => '',
            'address1' => $address->getStreetLine(1),
            'address2' => $address->getStreetLine(2),
            'address3' => $address->getStreetLine(3),
            'locality' => $address->getCity(),
            'administrativeArea' => $address->getRegionCode(),
            'country' => $address->getCountryId(),
            'postalCode' => $address->getPostcode(),
        ];
    }

    private function buildOrderInformation($quote){
        $orderInformation = [];
        
        $orderInformation['amountDetails'] = $this->buildAmountDetails($quote);
        
        $orderInformation['billTo'] = $this->buildAddress($quote->getBillingAddress());
        $orderInformation['billTo']['email'] = $quote->getBillingAddress()->getEmail();
        $orderInformation['billTo']['phoneNumber'] = $quote->getBillingAddress()->getTelephone();
        
        if ($quote->getShippingAddress()) {
            $orderInformation['shipTo'] = $this->buildAddress($quote->getShippingAddress());
        }

        return $orderInformation;

    }

    private function buildAmountDetails($quote){
        return  [
            'totalAmount'   => $this->formatAmount($quote->getGrandTotal()),
            'currency'      => $quote->getQuoteCurrencyCode()
        ];
    }


    /**
     * Converts magento allowed cc types to Unified Checkout format
     *
     * @return array
     */
    private function getSupportedNetworks()
    {
        $ccTypesMap = [
            'VI' => 'VISA',
            'MC' => 'MASTERCARD',
            'AE' => 'AMEX',
            'DI' => 'DISCOVER',
            'JCB' => 'JCB'
        ];

        $result = [];

        foreach ((array) $this->gatewayConfig->getCcTypes() as $type) {
            if (isset($ccTypesMap[$type])) {
                $result[] = $ccTypesMap[$type];
            }
        }

        return $result;
    }

    private function getLocale($storeId = null)
    {
        return str_replace('-', '_', strtolower(
            $this->gatewayConfig->getLocale($storeId)
                ?: $this->locale->getLocale()
        ));
    }

}