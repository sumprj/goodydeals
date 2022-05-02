<?php
/**
 * Copyright © 2018 CyberSource. All rights reserved.
 * See accompanying LICENSE.txt for applicable terms of use and license.
 */

namespace CyberSource\UnifiedCheckout\Model\Ui;

use Magento\Checkout\Model\ConfigProviderInterface;
use CyberSource\UnifiedCheckout\Gateway\Config\Config;
use Magento\Framework\Locale\ResolverInterface;

/**
 * Class ConfigProvider
 * @codeCoverageIgnore
 */
class ConfigProvider implements ConfigProviderInterface
{
    const CODE = 'unifiedcheckout';

    /**
     * @var ResolverInterface
     */
    private $localeResolver;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var \Magento\Framework\UrlInterface
     */
    private $url;

    /**
     * ConfigProvider constructor.
     * @param Config $config
     * @param ResolverInterface $localeResolver
     * @param \Magento\Framework\UrlInterface $url
     */
    public function __construct(
        Config $config,
        ResolverInterface $localeResolver,
        \Magento\Framework\UrlInterface $url
    ) {
        $this->config = $config;
        $this->localeResolver = $localeResolver;
        $this->url = $url;
    }

    /**
     * Retrieve assoc array of checkout configuration
     *
     * @return array
     */
    public function getConfig()
    {
        $isUnifiedCheckoutActive = $this->config->isActive();
        return [
            'payment' => [
                self::CODE => [
                    'isActive' => $isUnifiedCheckoutActive,
                    'title' => 'Unified Checkout',
                    'isDeveloperMode' => $this->config->isDeveloperMode(),
                    'placeOrderUrl' => $this->url->getUrl('unifiedcheckout/index/placeorder'),
                ]
            ]
        ];
    }
}
