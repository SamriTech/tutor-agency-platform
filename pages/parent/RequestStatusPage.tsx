
import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';

const RequestStatusPage: React.FC = () => {
    const currentStep = 2; // Mock current step
    const steps = [
        "Request Submitted",
        "Admin Reviewing Matches",
        "Tutor Confirmation Pending",
        "Session Scheduled"
    ];

    return (
        <div className="bg-neutral-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">My Tutor Request Status</h1>
                    
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-neutral-600 mb-8 text-center">Your request for a <strong>Grade 8 Mathematics</strong> tutor in <strong>Bole, Addis Ababa</strong> is in progress. Here's the current status:</p>
                        
                        <div className="space-y-8">
                            {steps.map((step, index) => (
                                <div key={step} className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                        <div>
                                            <div className={`flex items-center justify-center w-10 h-10 border-2 rounded-full ${index < currentStep ? 'bg-secondary border-secondary text-white' : index === currentStep ? 'bg-primary border-primary text-white' : 'border-neutral-300 text-neutral-400'}`}>
                                                {index < currentStep ? <CheckCircleIcon className="w-6 h-6" /> : (index + 1)}
                                            </div>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`w-0.5 h-full ${index < currentStep - 1 ? 'bg-secondary' : 'bg-neutral-300'}`}></div>
                                        )}
                                    </div>
                                    <div className={`pb-8 ${index === currentStep ? 'font-bold' : ''}`}>
                                        <p className={`mb-1 text-lg ${index === currentStep ? 'text-primary' : 'text-neutral-800'}`}>{step}</p>
                                        {index === 0 && <p className="text-sm text-neutral-500">We've received your request and our AI is finding the best matches.</p>}
                                        {index === 1 && <p className="text-sm text-neutral-500">Our team is manually verifying the top AI-suggested tutors to ensure quality and safety.</p>}
                                        {index === 2 && <p className="text-sm text-neutral-500">We have sent the request to the matched tutor. Waiting for them to accept.</p>}
                                        {index === 3 && <p className="text-sm text-neutral-500">Confirmed! You can now coordinate the final details with your tutor.</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RequestStatusPage;
