
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';

const PaymentSettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('bank');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Payment settings updated successfully!");
        navigate('/tutor/dashboard');
    };

    return (
        <div className="bg-neutral-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-neutral-800 mb-6">Payment Settings</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Payout Method</h2>
                        <p className="text-neutral-600 mb-6">Choose how you'd like to receive your earnings. Payouts are processed weekly.</p>

                        <div className="flex border-b mb-6">
                            <button onClick={() => setPaymentMethod('bank')} className={`px-4 py-2 text-sm font-medium ${paymentMethod === 'bank' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>
                                Bank Account
                            </button>
                            <button onClick={() => setPaymentMethod('chapa')} className={`px-4 py-2 text-sm font-medium ${paymentMethod === 'chapa' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>
                                Chapa
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {paymentMethod === 'bank' && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="bankName" className="block text-sm font-medium text-neutral-700">Bank Name</label>
                                        <input type="text" id="bankName" placeholder="e.g., Commercial Bank of Ethiopia" className="mt-1 w-full p-2 border rounded-md border-neutral-300" />
                                    </div>
                                    <div>
                                        <label htmlFor="accountNumber" className="block text-sm font-medium text-neutral-700">Account Number</label>
                                        <input type="text" id="accountNumber" placeholder="1000..." className="mt-1 w-full p-2 border rounded-md border-neutral-300" />
                                    </div>
                                    <div>
                                        <label htmlFor="accountHolder" className="block text-sm font-medium text-neutral-700">Account Holder Name</label>
                                        <input type="text" id="accountHolder" className="mt-1 w-full p-2 border rounded-md border-neutral-300" />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'chapa' && (
                                <div>
                                    <label htmlFor="chapaPhone" className="block text-sm font-medium text-neutral-700">Chapa Registered Phone Number</label>
                                    <input type="tel" id="chapaPhone" placeholder="+251 9..." className="mt-1 w-full p-2 border rounded-md border-neutral-300" />
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">Save Settings</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Tutor}>
            <PaymentSettingsPage />
        </RoleGuard>
    </AuthGuard>
);
