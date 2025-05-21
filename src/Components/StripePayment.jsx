import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripePayment = ({ clientSecret, course, paymentType, installmentPlan, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get billing details from form
      const billingDetails = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
      };

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails,
        },
      });

      if (result.error) {
        setError(result.error.message);
        onError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      onError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = () => {
    if (paymentType === 'full') {
      return course.price;
    } else {
      return (course.price / parseInt(installmentPlan)).toFixed(2);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            required
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Information
        </label>
        <div className="p-4 border rounded-md bg-white">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">
            {paymentType === 'full' ? 'Total Amount' : 'Monthly Payment'}:
          </span>
          <span className="font-bold">
            ${calculateAmount()}
            {paymentType === 'installment' && ` × ${installmentPlan} months`}
          </span>
        </div>
        
        {paymentType === 'installment' && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold">${course.price}</span>
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 px-4 rounded-md font-medium text-white mt-4
          ${!stripe || loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {loading ? 'Processing...' : `Pay ${paymentType === 'full' ? `$${course.price}` : 'Now'}`}
      </button>
    </form>
  );
};

export default StripePayment;