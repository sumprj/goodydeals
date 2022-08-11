const {PaymentMethod} = require('../../../helper/dbUtils');
const unifiedPaymentMethod = new PaymentMethod('unifiedcheckout');

function buildSessionRequest(object)
{
    email = getCustomerEmail();
    request = {};

    targetOrigins = ["https://127.0.0.1"];
    request['targetOrigins'] = targetOrigins;
    request['clientVersion'] = "0.6"; 
    request['allowedCardNetworks'] = getSupportedNetworks();
    request['allowedPaymentTypes'] = ["PANENTRY","SRC"]; 
    request['country'] = getBillingAddress().countryId;
    request['locale'] = unifiedPaymentMethod.getLocale();
    request['captureMandate'] = buildCaptureMandate();
    
    request['orderInformation'] = buildOrderInformation(object);

    return request;
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

function buildAddress(address)
{
    return {
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
    };
}

function buildOrderInformation(object){
    orderInformation = [];
    
    orderInformation['amountDetails'] = buildAmountDetails(object);
    
    orderInformation['billTo'] = buildAddress(object.billingAddress);
    orderInformation['billTo']['email'] = object.billingAddress.email;
    orderInformation['billTo']['phoneNumber'] = object.billingAddress.telephone;
    
    if (object.getShippingAddress()) {
        orderInformation['shipTo'] = buildAddress(object.shippingAddress);
    }

    return orderInformation;

}

function buildAmountDetails(object){
    return  {
        'totalAmount'   : formatAmount(object.getGrandTotal()),
        'currency'      : object.getCurrencyCode()
    };
}


/**
 * Converts magento allowed cc types to Unified Checkout format
 *
 * @return array
 */
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
