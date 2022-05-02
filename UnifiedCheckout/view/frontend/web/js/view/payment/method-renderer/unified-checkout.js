define([
    'jquery',
    'ko',
    'Magento_Checkout/js/view/payment/default',
    'unified',
    'Magento_Checkout/js/model/payment/additional-validators',
    'Magento_Checkout/js/model/quote',
    'Magento_Customer/js/customer-data',
    'Magento_Checkout/js/action/set-billing-address',
    'Magento_Checkout/js/action/set-shipping-information',
    'Magento_Checkout/js/model/full-screen-loader',
    'mage/url',
    'jquery/ui',
    'mage/translate'
],
    function (
        $,
        ko,
        Component,
        unified,
        additionalValidators,
        quote,
        customerData,
        setBillingAddress,
        setShippingInformation,
        fullScreenLoader,
        urlBuilder) {
        'use strict';

        var transientToken = null;
        return Component.extend({
            defaults: {
                template: 'Cybersource_UnifiedCheckout/payment/payment-form' ,
                active: ko.observable(false),
                code: 'unifiedcheckout',
                grandTotalAmount: null,
                currencyCode: null,
                initErrorMessage: ko.observable(null),
                count: 0,
                imports: {
                    onActiveChange: 'active'
                }
            },
            isTokenGenerated: ko.observable(false), 
            initialized: ko.observable(false),
            initObservable: function () {
                var self = this;
                this.isPlaceOrderActionAllowed(false);
                    this._super()
                        .observe(['active']);
                this.initToken();
                return this;
            },

            updateSession: function () {
                $.ajax({
                    method: 'POST',
                    url: urlBuilder.build("unifiedcheckout/index/session"),
                    data: {
                        'form_key': $.cookie('form_key'),
                        'guestEmail': quote.guestEmail,
                        'updateToken': true
                    }
                });
            },
            onActiveChange: function (isActive) {

                if (isActive && !this.initialized()) {
                    this.initToken();
                }
                return;
            },
            getCode: function () {
                return this.code;
            },

            isActive: function () {
                var active = this.getCode() === this.isChecked();

                this.active(active);

                return active;
            },

            initToken: function() {
                var self = this;
                fullScreenLoader.startLoader();
                self.isPlaceOrderActionAllowed(false);
                var sessionData = {
                    'form_key': $.cookie('form_key'),
                    'guestEmail': quote.guestEmail
                };
                $.ajax({
                    method: 'GET',
                    url: urlBuilder.build("unifiedcheckout/index/session"),
                    data: sessionData,
                    success: function(data){
                        var cc = data.captureContext.response;
                        console.log(cc);
                        if(cc!=''){
                            fullScreenLoader.stopLoader();
                            var showArgs = {
                                containers: {
                                    paymentSelection: "#buttonPaymentListContainer"
                                }
                            };
                            unified.Accept(cc)
                            .then(function(accept) {
                                return accept.unifiedPayments();
                            })
                            .then(function(up) {
                                return up.show(showArgs);
                            })
                            .then(function(tt) {
                                console.log(tt);
                                transientToken = tt;
                            });
                        }else{
                            alert('Capture Context not generated !!');
                            fullScreenLoader.stopLoader();
                        }
                        
                        if(transientToken != null){
                            self.isPlaceOrderActionAllowed(true);
                        }
                    }
                });
            },

            getPlaceOrderUrl: function () {
                return window.checkoutConfig.payment[this.getCode()].placeOrderUrl;
            },

            placeOrder: function () {
                var self = this;

                /* if (!this.validate() || !additionalValidators.validate()) {
                    return;
                } */
                this.isPlaceOrderActionAllowed(false);
                fullScreenLoader.startLoader();
                var form = $(document.createElement('form'));
                $(form).attr("action", self.getPlaceOrderUrl());
                $(form).attr("method", "POST");
                $(form).append($('<input/>').attr('name', 'transientToken').attr('value', transientToken));
                $(form).append($('<input/>').attr('name', 'quoteId').attr('value', quote.getQuoteId()));
                $(form).append($('<input/>').attr('name', 'guestEmail').attr('value', quote.guestEmail));
                $(form).append($('<input/>').attr('name', 'form_key').attr('value', $.cookie('form_key')));
                $(form).append('<input name="agreementId" value="' + $("#unifiedcheckout").parent().parent().children('.payment-method-content').children(".checkout-agreements-block").children().children().children().children().val() + '"/>');
                $("body").append(form);
                $(form).submit();
                customerData.invalidate(['cart']);
                fullScreenLoader.stopLoader();
            }
        });
    }
);