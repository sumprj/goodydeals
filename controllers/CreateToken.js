// const restClient = require('./service/payment/restClient');
const requestBuilder = require('../service/payment/unifiedcheckout/requestBuilder');


function execute(request){
    result = {};
    const paymentRequest = requestBuilder.buildTokenRequest()
    console.log(paymentRequest);
    // try {
    //     paymentResponse = restClient->placeRequest(paymentRequest);
    //     if(paymentResponse){
    //         result['captureContext'] = paymentResponse;
    //     }
    // } catch (error) {
    //     result['error'] = true;
    //     result['errorMessage'] = 'An error occured while initializing Unified Checkout';
    // }
}

module.exports = {
    execute:execute
}