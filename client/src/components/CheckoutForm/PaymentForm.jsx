import React from 'react';
import {Button, Divider, Typography} from "@material-ui/core";
import Review from "./Review";
import {CardElement, Elements, ElementsConsumer} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js/pure";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({checkoutToken, backStep, onCaptureCheckout, nextStep, shippingData, timeout}) => {
   const handleSubmit = async (event, elements, stripe) => {
      event.preventDefault();
      if (!stripe || !elements) return null;
      const cardElement = elements.getElement(CardElement);
      const {error, paymentMethod} = await stripe.createPaymentMethod({type: "card", card: cardElement})
      if (error) {
         console.log(error)
      } else {
         const orderData = {
            line_items: checkoutToken.live.line_items,
            customer: {firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email},
            shipping: {
               name: "Primary", street: shippingData.address1, town_city: shippingData.city,
               county_state: shippingData.shippingSubDivision, postal_zip_code: shippingData.zip,
               country: shippingData.shippingCountry
            },
            fulfillment: {shipping_method: shippingData.shippingOption},
            payment: {
               gateway: "stripe",
               stripe: {
                  payment_method_id: paymentMethod.id
               }
            }
         }
         onCaptureCheckout(checkoutToken.id, orderData);
         timeout()
         nextStep();
      }
   }

   return (
      <>
         <Review checkoutToken={checkoutToken}/>
         <Divider/>
         <Typography variant={"h6"} gutterBottom style={{margin: "20px 0"}}>Ödeme Methodu</Typography>
         <Elements stripe={stripePromise}>
            <ElementsConsumer>
               {({elements, stripe}) => (
                  <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                     <CardElement/>
                     <br/><br/>
                     <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Button variant={"outlined"} onClick={backStep}>Geri Dön</Button>
                        <Button variant={"contained"} type={"submit"} disabled={!stripe} color={"primary"}>
                           Ödeme {checkoutToken.live.subtotal.formatted_with_symbol}
                        </Button>
                     </div>
                  </form>
               )}
            </ElementsConsumer>
         </Elements>
      </>
   )
}

export default PaymentForm;