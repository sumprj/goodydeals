<?php

namespace CyberSource\UnifiedCheckout\Block;


class Unified extends \Magento\Framework\View\Element\Template
{

    /**
     * @var \CyberSource\UnifiedCheckout\Gateway\Config\Config
     */
    private $config;

    /**
     * Flex constructor.
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \CyberSource\UnifiedCheckout\Gateway\Config\Config $config
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \CyberSource\UnifiedCheckout\Gateway\Config\Config $config,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->config = $config;
    }

    /**
     * @return bool
     */
    public function isSandbox()
    {
        return $this->config->isTestMode();
    }

}
