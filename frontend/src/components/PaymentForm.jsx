import {useState} from "react";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from "axios";

const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#c4f0ff',
            color: '#fff',
            fontWeight: 500,
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {color: '#fce883'},
            '::placeholder': {color: '#87bbfd'},
        },
        invalid: {
            iconColor: '#ffc7ee',
            color: '#ffc7ee',

        }
    }
}


const PaymentForm = () => {
    const [success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();



    const handleSubmit = async (e) => {
        e.preventDefault()
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        })

        if (!error) {
            try {
                const {id} = paymentMethod
                const response = await axios.post('http://localhost:8000/api/payment', {
                    amount: 1,
                    id
                })

                if (response.data.success) {
                    console.log('Successful payment')
                    setSuccess(true)

                }
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log(error)
        }
    }


    return (
        <div>
            {!success ?
                <form onSubmit={handleSubmit} className={'paymentForm'}>
                    <fieldset className="FormGroup">

                        <div className="FormRow">
                            <CardElement options={CARD_OPTIONS}/>
                        </div>
                    </fieldset>
                    <button>Pay</button>
                </form>
            :
                <div>
                    <h2>Payment Successful</h2>
                </div>
            }

        </div>
    )

}
export default PaymentForm;

