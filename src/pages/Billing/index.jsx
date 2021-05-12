import React, { useState, useEffect } from "react";
import PaytmCheckout from "components/PaytmCheckout"
import call from "api/apiRequest";

export default function Billing({ }) {

    const [txn, setTxn] = useState(null);

    useEffect(async () => {
      const res = await call({
          method: 'POST',
          url: '/create-transaction',
          data: { amount: 10.0}
      });
      const {data} = res.data;
      setTxn(data);
      console.log("res: ", res)
    }, []);

    const config = {
        "root": "#checkout-hook",
        "flow": "DEFAULT",
        "data": {
        "orderId": "", /* update order id */
        "token": "", /* update token value */
        "tokenType": "TXN_TOKEN",
        "amount": "10" /* update amount */
        },
        merchant: {
            mid: "CJzXZD97345717198751",
            name: "Ludokhelo"
        },
        "handler": {
          "notifyMerchant": function(eventName,data){
            console.log("notifyMerchant handler function called");
            console.log("eventName => ",eventName);
            console.log("data => ",data);
          } 
        }
    }

 return <div>Billing
     <div>
         {txn && <PaytmCheckout config={{...config, data: {...config.data, token: txn.txnToken, orderId: txn.orderId}}}/>}
     </div>
     <div id="#checkout-hook"></div>
 </div>
}



// Buy.propTypes = {
//   userDetails: PropTypes.object,
//   isValid: PropTypes.bool,
//   submitForm: PropTypes.func,
//   buyChips: PropTypes.func,
//   resetForm: PropTypes.func,
//   settings: PropTypes.object
// };
