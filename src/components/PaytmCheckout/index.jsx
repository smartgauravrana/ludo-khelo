import React from 'react';
import { CheckoutProvider, Checkout, injectCheckout} from 'paytm-blink-checkout-react';

export default function PaytmCheckout({ config }) {
    return (
        <CheckoutProvider config={config} openInPopup="false" env='STAGE'>
            <Checkout />
        </CheckoutProvider>
    )
}