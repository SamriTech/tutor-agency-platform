import React, { useState } from 'react';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import ProfileLayout from '../../components/ui/ProfileLayout';
import CreditCardIcon from '../../components/icons/CreditCardIcon';

const ParentPaymentSettingsPage: React.FC = () => {
    const [savedCards, setSavedCards] = useState([
        { id: 1, last4: '4242', brand: 'Visa', expiry: '12/25' }
    ]);

    return (
        <ProfileLayout userRole="parent" pageTitle="Payment Methods">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">Saved Cards</h2>
                    <p className="text-neutral-500">Manage your payment methods and billing information.</p>
                </div>

                <div className="space-y-4 mb-8">
                    {savedCards.map(card => (
                        <div key={card.id} className="flex items-center justify-between p-6 border-2 border-neutral-50 rounded-2xl hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/5 rounded-xl">
                                    <CreditCardIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-bold text-neutral-900">{card.brand} •••• {card.last4}</div>
                                    <div className="text-sm text-neutral-500 font-medium">Expires {card.expiry}</div>
                                </div>
                            </div>
                            <button className="text-sm font-bold text-neutral-400 hover:text-red-500 transition-colors">
                                Remove
                            </button>
                        </div>
                    ))}

                    <button className="w-full flex items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-100 rounded-2xl text-neutral-400 font-bold hover:border-primary/20 hover:text-primary transition-all">
                        <span>+ Add New Payment Method</span>
                    </button>
                </div>

                <div className="pt-8 border-t border-neutral-50">
                    <h3 className="text-lg font-bold text-neutral-900 mb-4">Billing Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Country</label>
                            <input
                                type="text"
                                value="Ethiopia"
                                readOnly
                                className="w-full p-4 border-2 border-neutral-50 rounded-xl bg-neutral-50 text-neutral-500 font-medium cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Currency</label>
                            <input
                                type="text"
                                value="ETB"
                                readOnly
                                className="w-full p-4 border-2 border-neutral-50 rounded-xl bg-neutral-50 text-neutral-500 font-medium cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Parent}>
            <ParentPaymentSettingsPage />
        </RoleGuard>
    </AuthGuard>
);
