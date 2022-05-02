'use strict';

var restApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);

function simple_authorization_internet(callback, enable_capture) {
	try {
		var configObject = new configuration();
		var apiClient = new restApi.ApiClient();
		var requestObj = new restApi.CreatePaymentRequest();

		var clientReferenceInformation = new restApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = 'TC50171_3';
		requestObj.clientReferenceInformation = clientReferenceInformation;

		var processingInformation = new restApi.Ptsv2paymentsProcessingInformation();
		processingInformation.capture = false;
		if (enable_capture === true) {
			processingInformation.capture = true;
		}

		requestObj.processingInformation = processingInformation;

		var paymentInformation = new restApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationCard = new restApi.Ptsv2paymentsPaymentInformationCard();
		paymentInformationCard.number = '4111111111111111';
		paymentInformationCard.expirationMonth = '12';
		paymentInformationCard.expirationYear = '2031';
		paymentInformation.card = paymentInformationCard;

		requestObj.paymentInformation = paymentInformation;

		var orderInformation = new restApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new restApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = '50.00';
		orderInformationAmountDetails.currency = 'USD';
		orderInformation.amountDetails = orderInformationAmountDetails;

		var orderInformationBillTo = new restApi.Ptsv2paymentsOrderInformationBillTo();
		orderInformationBillTo.firstName = 'John';
		orderInformationBillTo.lastName = 'Doe';
		orderInformationBillTo.address1 = '1 Market St';
		orderInformationBillTo.locality = 'san francisco';
		orderInformationBillTo.administrativeArea = 'CA';
		orderInformationBillTo.postalCode = '94105';
		orderInformationBillTo.country = 'US';
		orderInformationBillTo.email = 'test@cybs.com';
		orderInformationBillTo.phoneNumber = '4158880000';
		orderInformation.billTo = orderInformationBillTo;

		requestObj.orderInformation = orderInformation;


		var instance = new restApi.PaymentsApi(configObject, apiClient);

		instance.createPayment(requestObj, function (error, data, response) {
			if (error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Process a Payment : ' + JSON.stringify(response['status']));
			callback(error, data, response);
		});
	}
	catch (error) {
		console.log('\nException on calling the API : ' + error);
	}
}
if (require.main === module) {
	simple_authorization_internet(function () {
		console.log('\nCreatePayment end.');
	});
}
module.exports.simple_authorization_internet = simple_authorization_internet;
