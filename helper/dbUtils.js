const Role = require('../models/admin/Role');
const AdminUser = require('../models/admin/User');
const CatalogueCategory = require('../models/Catalogue/Category');
const CatalogueProduct = require('../models/Catalogue/Products');
const paymentConfig = require('../models/Store/Payment/Config');

let createSampleCatalogueDone = false;

const rolePrivilegeMap = {
	5:'OWNER',
	4:'ADMINISTRATOR',
	3:'CATALOGUE_MANAGER',
	2:'ORDER_MANAGER',
	1:'ORDER_READ_ONLY_USER'
}

/**
 * Returns true if Owner Role is created and false if owner role is not found
 * @returns boolean
 */
async function isAdminOwnerRoleCreatedSync(){
	let ownerExists = false;
	try{
		let data = await findAdminOwnerRoleSync();
		if(data)
		{
			ownerExists = true;
		}
	}
	catch(err){
		console.error("Admin Owner Role Search failed");
		console.error(err);
	}
	return ownerExists;
}


async function findAdminOwnerRoleSync(){
	return await Role.findOne({roleName:rolePrivilegeMap[5]});
}

async function findAdminOwnerSync(){
	return await AdminUser.findOne({role: await findAdminOwnerRoleSync()});
}

async function findCatalogueCategories(filter){
	let catalogueCategories = null;
	try {
		catalogueCategories = await CatalogueCategory.findOne(filter);
	} catch(err) {
		console.log(err);
	}
	return catalogueCategories;
}

async function findCatalogueProductBySkuid(skuid){
	let catalogueProduct = null;
	try {
		catalogueProduct = await CatalogueProduct.findOne({skuid:skuid});
	} catch(err) {
		console.log(err);
	}
	return catalogueProduct;
}

async function findAllCatalogueProducts(callback){
	let catalogueProduct = null;
	try {
		catalogueProduct = await CatalogueProduct.find({});
	} catch(err) {
		console.log(err);
	}
	callback(catalogueProduct);
}


/**
 * 
 * @param {object} productData
 * @param {function} callback 
 */
async function addNewProduct(productData, callback){
	const product = new CatalogueProduct(productData);
	const response = {error:false};
	try{
		if(await findCatalogueCategories({_id:productData.category})){
			if(await findCatalogueProductBySkuid(productData.skuid)){
				response.error = true;
				response.errorMessage = 'Skuid already exists. Please enter a different skuid';
			}
			else{
				await product.save();
			}
		}
		else{
			response.error = true;
			response.errorMessage = 'Unexpected error occured while saving your data. Category does not exist. Please refresh page and try again.'
		}

	} catch (err) {
		response.error = true;
		response.errorMessage = 'An error occured saving the data. Please check logs for more details';
		console.error(err);
	}
	callback(response);
}

async function updatePaymentConfig(code, update, callback){
	try {
		await paymentConfig.findOneAndUpdate({
			paymentCode: code
		},update);
		callback(false);	
	} catch (err) {
		callback(true);	
	}
}

async function getPaymentConfig(filter){
	return await paymentConfig.find(filter);
}

async function getPaymentDataByCode(code){
	try {
		const payment = await paymentConfig.findOne({paymentCode:code});
		return payment;		
	} catch (err) {
		return {};
	}
}

async function getAllPaymentConfig(callback){
	const paymentConfigData = await getPaymentConfig({});
	callback(paymentConfigData);
}

async function getAllPaymentCode(callback){
	const paymentConfigData = await getPaymentConfig({});
	const paymentCodes = paymentConfigData.map(payment => payment.paymentCode);
	callback(paymentCodes);
}

async function getAllPaymentCodeSync(){
	const paymentConfigData = await getPaymentConfig({});
	const paymentCodes = paymentConfigData.map(payment => payment.paymentCode);
	return paymentCodes;
}


/**
 * creates an Admin Owner
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {string} email 
 * @param {string} firstname 
 * @param {string} lastname 
 */
async function createOwner(username, password, email, firstName, lastName){
	const role = new Role({roleName:rolePrivilegeMap[5], privileges:5});
	const unifiedCheckoutData = new paymentConfig({
		paymentCode: 'unifiedcheckout',
	});
	if(!(await findAdminOwnerRoleSync())){
		try
		{
			await role.save();
		}
		catch(err)
		{
			console.error("Admin Owner Role creation failed");
			console.error(err);
		}
	}
	
	
	console.log(await findAdminOwnerSync());
	if(!(await findAdminOwnerSync())){
		const adminUser = new AdminUser({
			userName: username,
			password: password,
			email: email,
			firstName: firstName,
			lastName: lastName,
			role: await findAdminOwnerRoleSync()
		});
		adminUser.save();
		unifiedCheckoutData.save();
	}
}

async function createSampleCatalogue(){
	const CatalogueCategories = await findCatalogueCategories({});
	if(!CatalogueCategories){
		try{
			const catalogueCategory = new CatalogueCategory({categoryName:'Television'})
			catalogueCategory.save();
		}catch(err){
			console.error(err);
		}
	}
}

class PaymentMethod{
	constructor(code)
	{
		this.code = code;
		this.getPaymentData = getPaymentDataByCode(this.code);
	}
	async getMerchantId(){
		const paymentData = await this.getPaymentData;
		return paymentData['merchantId'];
	}
	async getRestKeyId(){
		const paymentData = await this.getPaymentData;
		return paymentData['restKeyId'];
	}
	async getRestSharedSecret(){
		const paymentData = await this.getPaymentData;
		return paymentData['restSharedSecret'];
	}
	async getLocale()
	{
		const paymentData = await this.getPaymentData;
		return paymentData['locale'];
	}
	async isActive(){
		const paymentData = await this.getPaymentData;
		return paymentData['enabled'];
	}
	async isProductionMode(){
		const paymentData = await this.getPaymentData;
		return paymentData['productionMode'];
	}
	async getTitle(){
		const paymentData = await this.getPaymentData;
		return paymentData['title'];
	}
	async getcardTypes(){
		const paymentData = await this.getPaymentData;
		return paymentData['cardTypes'];
	}
}




module.exports = {
	findCatalogueCategories : findCatalogueCategories,
	findCatalogueProductBySkuid : findCatalogueProductBySkuid,
	addNewProduct:addNewProduct,
	findAllCatalogueProducts : findAllCatalogueProducts,
	updatePaymentConfig : updatePaymentConfig,
	getAllPaymentConfig: getAllPaymentConfig,
	createSampleCatalogue: createSampleCatalogue,
	createOwner: createOwner,
	getAllPaymentCode: getAllPaymentCode,
	getAllPaymentCodeSync: getAllPaymentCodeSync,
	PaymentMethod: PaymentMethod
}