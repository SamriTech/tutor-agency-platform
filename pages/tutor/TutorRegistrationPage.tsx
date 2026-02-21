
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

const TutorRegistrationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Your application has been submitted! Our team will review it and you will be notified within 48 hours.');
    navigate('/login');
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 1: Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input type="tel" className="mt-1 w-full rounded-md border-neutral-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Bio / Short Introduction</label>
                <textarea rows={4} className="mt-1 w-full rounded-md border-neutral-300 shadow-sm"></textarea>
              </div>
              <button onClick={nextStep} className="w-full bg-primary text-white py-2 rounded-md">Next</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 2: Qualifications & Subjects</h2>
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium">Highest Qualification</label>
                <input type="text" placeholder="e.g., BSc in Computer Science" className="mt-1 w-full rounded-md border-neutral-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Subjects you can teach</label>
                <input type="text" placeholder="e.g., Math, Physics, English" className="mt-1 w-full rounded-md border-neutral-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Upload Certificates (PDF, JPG)</label>
                <input type="file" multiple className="mt-1 w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="w-full bg-neutral-200 py-2 rounded-md">Back</button>
                <button onClick={nextStep} className="w-full bg-primary text-white py-2 rounded-md">Next</button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
           <div>
            <h2 className="text-xl font-bold mb-4">Step 3: Identity Verification</h2>
            <p className="text-sm text-neutral-600 mb-4">Please upload a clear image of your National ID (front side). This is crucial for building trust with parents and will not be shared publicly.</p>
            <div>
                <label className="block text-sm font-medium">National ID Upload</label>
                <input type="file" className="mt-1 w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            </div>
            <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="w-full bg-neutral-200 py-2 rounded-md">Back</button>
                <button onClick={handleSubmit} className="w-full bg-secondary text-white py-2 rounded-md">Submit Application</button>
            </div>
          </div>
        )
      default:
        return null;
    }
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Become a Hytor Tutor</h1>
          <p className="text-center text-neutral-500 mb-8">Join our community of trusted educators.</p>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between text-xs">
                    <div className="font-semibold text-primary">{step === 1 ? 'Personal Info' : step === 2 ? 'Qualifications' : 'Verification'}</div>
                    <div className="font-semibold">{step} of 3</div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                    <div style={{ width: `${(step / 3) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
                </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            {renderStep()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorRegistrationPage;
