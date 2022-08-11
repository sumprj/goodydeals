const { PaymentMethod } = require("../../../helper/dbUtils");



async function buildTokenRequest(PaymentDO)
{
    const payment = new PaymentMethod('unifiedcheckout');
    // email = getCustomerEmail();
    request = {};

    targetOrigins = ["https://127.0.0.1"];
    request['targetOrigins'] = targetOrigins;
    request['clientVersion'] = "0.6"; 
    request['allowedCardNetworks'] = getSupportedNetworks();
    request['allowedPaymentTypes'] = ["PANENTRY","SRC"]; 
    // request['country'] = getBillingAddress().countryId;
    request['country'] = 'US';
    request['locale'] = await payment.getLocale();
    request['captureMandate'] = buildCaptureMandate();
    
    request['orderInformation'] = buildOrderInformation(PaymentDO);

    return request;
}

function buildOrderInformation(PaymentDO){
    orderInformation = {};
    
    /* orderInformation['amountDetails'] = buildAmountDetails(object);
    
    orderInformation['billTo'] = buildAddress(object.billingAddress);
    orderInformation['billTo']['email'] = object.billingAddress.email;
    orderInformation['billTo']['phoneNumber'] = object.billingAddress.telephone;
    
    if (object.getShippingAddress()) {
        orderInformation['shipTo'] = buildAddress(object.shippingAddress);
    } */

    orderInformation['amountDetails'] = 25.48;
    
    orderInformation['billTo'] = buildAddress();
    orderInformation['billTo']['email'] = 'sumit.prajapati@gmail.com';
    orderInformation['billTo']['phoneNumber'] = '20128383883883';

    orderInformation['shipTo'] = buildAddress();    


    return orderInformation;
}

function buildAddress(address)
{
    /* return {
        'firstName' : address.getFirstname(),
        'lastName' : address.getLastname(),
        'buildingNumber' : '',
        'address1' : address.getStreetLine(1),
        'address2' : address.getStreetLine(2),
        'address3' : address.getStreetLine(3),
        'locality' : address.getCity(),
        'administrativeArea' : address.getRegionCode(),
        'country' : address.getCountryId(),
        'postalCode' : address.getPostcode(),
    }; */
    return {
        'firstName' : 'sumit',
        'lastName' : 'Prajapati',
        'buildingNumber' : '',
        'address1' : '106/J bireswar chatterjee street',
        'address2' : 'Bally',
        'address3' : '',
        'locality' : 'Howrah',
        'administrativeArea' : '',
        'country' : 'IN',
        'postalCode' : '711201',
    };
}


function buildCaptureMandate(){
    return {
        'billingType' : "FULL", 
        'requestEmail' : true, 
        'requestPhone' : true, 
        'requestShipping' : true, 
        'shipToCountries' : [ "US", "GB" ],
        'showAcceptedNetworkIcons' : true
    };
}

function getSupportedNetworks()
{
    return [
        'VISA',
        'MASTERCARD',
        'AMEX',
        'DISCOVER',
        'JCB'
    ];
}


module.exports = {
    buildTokenRequest: buildTokenRequest
}