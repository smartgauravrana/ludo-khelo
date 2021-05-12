const { v4: uuidv4 } = require('uuid');
const Paytm = require('paytm-pg-node-sdk');

const { MID, MKEY, WEBSITE, INDUSTRY_TYPE, WEBSITE_CHANNEL_ID, APP_CHANNEL_ID } = process.env


const APIDETAILS = {
    merchantId: MID,
    merchantKey: MKEY,
    website: WEBSITE,
    industryType: INDUSTRY_TYPE,
    websiteChannelId: WEBSITE_CHANNEL_ID,
    appChannelId: APP_CHANNEL_ID
}

// For Staging 
const environment = Paytm.LibraryConstants.STAGING_ENVIRONMENT;

// For Production 
// var environment = Paytm.LibraryConstants.PRODUCTION_ENVIRONMENT;

// Find your mid, key, website in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
const mid = APIDETAILS.merchantId;
const key = APIDETAILS.merchantKey;
const website = "Ludokhelo";
const client_id = "YOUR_CLIENT_ID_HERE";

const callbackUrl = "/api/post-transaction";
Paytm.MerchantProperties.setCallbackUrl(callbackUrl);

Paytm.MerchantProperties.initialize(environment, mid, key, client_id, website);

const createTransactionToken = async (orderData) => {
    console.log(typeof orderData.amount, " : ", orderData.amount)
    const channelId = Paytm.EChannelId.WEB;
    const orderId = uuidv4();
    const txnAmount = Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, ""+orderData.amount);
    const userInfo = new Paytm.UserInfo("9896192919"); 
    userInfo.setFirstName("Gaurav");
    userInfo.setMobile("9896192919");
    const paymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo);
    const paymentDetail = paymentDetailBuilder.build();
    const response = await Paytm.Payment.createTxnToken(paymentDetail);
    console.log("Response: ", response)
    const result = {
        ...response.responseObject.body,
        orderId
    }
    return result
}

module.exports = {
    createTransactionToken
}