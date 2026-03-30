import React, { useState } from 'react';
import { CreditCard, Lock, X, CheckCircle, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  lawyerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, lawyerName, onClose, onSuccess }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCvv(value.slice(0, 3));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API Gateway Delay
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Allow user to see Success Checkmark before executing backend save
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-6 object-cover flex justify-between items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <CreditCard className="w-48 h-48 -mr-10 -mt-10" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Secure Checkout</h2>
            <p className="text-gray-500 text-sm">LexHub Trusted Payment Gateway</p>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing || isSuccess}
            className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-blue-50/50 rounded-xl p-4 mb-6 border border-blue-100 flex justify-between items-center">
             <div>
               <p className="text-sm text-gray-500 font-medium">To: {lawyerName}</p>
               <p className="text-xs text-blue-600 mt-0.5">1 Hour Consultation</p>
             </div>
             <div className="text-right">
               <p className="text-sm text-gray-500 font-medium">Total Payable</p>
               <p className="text-xl font-bold text-blue-900">Rs {amount.toLocaleString()}</p>
             </div>
          </div>

          {isSuccess ? (
             <div className="py-12 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                     <CheckCircle className="w-10 h-10" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                 <p className="text-gray-500">Your consultation is verified.</p>
             </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none tracking-wide"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-center"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    value={cvv}
                    onChange={handleCvvChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none tracking-[0.2em] text-center"
                    placeholder="•••"
                  />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isProcessing || cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3 || name.length < 3}
                  className="w-full relative flex items-center justify-center -mb-2 py-4 bg-gray-900 border border-transparent rounded-xl shadow-lg hover:bg-gray-800 text-white font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing Bank Gateway...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2 opacity-80" />
                      Pay Rs {amount.toLocaleString()} Securely
                    </>
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 mt-4">
                 <Lock className="w-3 h-3" /> PCI DSS Compliant Bank Encryption
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
