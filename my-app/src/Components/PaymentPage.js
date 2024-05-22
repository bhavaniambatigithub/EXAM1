import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentPage = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error(error);
      return;
    }

    const response = await axios.post('/api/payment', {
      name,
      amount,
      paymentMethodId: paymentMethod.id,
    });

    console.log(response.data); // Handle success or error response from backend
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <CardElement />
        <button type="submit" disabled={!stripe}>Pay</button>
      </form>
    </div>
  );
};

export default PaymentPage;
