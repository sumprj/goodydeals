const Role = require('../models/admin/Role');
const AdminUser = require('../models/admin/User');
const CatalogueCategory = require('../models/Catalogue/Category');
const CatalogueProduct = require('../models/Catalogue/Products');

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




/**
 * creates an Admin Owner
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {string} email 
 * @param {string} firstname 
 * @param {string} lastname 
 */
module.exports.createOwner = async function (username, password, email, firstName, lastName){
	const role = new Role({roleName:rolePrivilegeMap[5], privileges:5});
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
	}
}

module.exports.createSampleCatalogue = async function (){
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


module.exports.findCatalogueCategories = findCatalogueCategories;
module.exports.findCatalogueProductBySkuid = findCatalogueProductBySkuid;
module.exports.addNewProduct = addNewProduct;
module.exports.findAllCatalogueProducts = findAllCatalogueProducts;