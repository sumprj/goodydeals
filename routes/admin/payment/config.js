const router = require("express").Router();
const {getAllPaymentConfig,updatePaymentConfig, getAllPaymentCode} = require('../../../helper/dbUtils');


/**
 * @returns object
 */
function getPaymentsConfigAdditionalData(){
    return {
        unifiedcheckout: {backStoreSectionHeader: 'Unified Checkout Configuration'}
    }
}

router.get("/", (req, res) => {
    let errorMessage = '';
    if(req.session&&req.session.payment&&req.session.payment.config&&req.session.payment.config.errorMessage)
    {
        errorMessage = req.session.payment.config.errorMessage;
        req.session.payment.config.errorMessage = '';
    }
    getAllPaymentConfig((paymentsConfig)=>{
        res.render('./admin/store/configuration/payment',{
            paymentsConfig: paymentsConfig,
            paymentsConfigAdditionalData: getPaymentsConfigAdditionalData(),
            errorMessage: errorMessage
        })
    })
})

router.post("/save", (req,res) => {
    
    getAllPaymentCode((paymentsCode)=>{
        paymentsCode.forEach((code) => {
            const updateObj = {};
            if(req.body['payment-' + code + '-enabled'])
            {
                updateObj['enabled'] = req.body['payment-' + code + '-enabled'];
            }
            if(req.body['payment-' + code + '-title'])
            {
                updateObj['title'] = req.body['payment-' + code + '-title'];
            }
            if(req.body['payment-' + code + '-productionMode'])
            {
                updateObj['productionMode'] = req.body['payment-' + code + '-productionMode'];
            }
            if(req.body['payment-' + code + '-merchantId'])
            {
                updateObj['merchantId'] = req.body['payment-' + code + '-merchantId'];
            }
            if(req.body['payment-' + code + '-restKeyId'])
            {
                updateObj['restKeyId'] = req.body['payment-' + code + '-restKeyId'];
            }
            if(req.body['payment-' + code + '-restSharedSecret'])
            {
                updateObj['restSharedSecret'] = req.body['payment-' + code + '-restSharedSecret'];
            }
        console.log("Starteedd");
            console.log(updateObj);
            updatePaymentConfig(code, updateObj, (error)=>{
                if(error){
                    configSession = {
                        config:{
                            errorMessage: "An Error occured While saving the config."
                        }
                    }
                    req.session.payment = configSession;
                }
                else{
                    configSession = {
                        config:{
                            SuccessMessage: "Saved config successfully."
                        }
                    }
                }
                res.redirect('/admin/store/configuration/payments');
            });
        });
        
        console.log(req.session);
    })
})


module.exports = router;