
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { GRADE_LEVELS, SUBJECTS } from '../constants';
import { ParentRequest } from '../types';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [request, setRequest] = useState<ParentRequest>({
    gradeLevel: GRADE_LEVELS[0],
    subject: SUBJECTS[0],
    mode: 'in-person',
    location: '',
    budget: 500,
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequest(prev => ({ ...prev, [name]: value }));
  };
  
  const handleModeChange = (mode: 'in-person' | 'online') => {
    setRequest(prev => ({ ...prev, mode }));
  };

  const handleFindTutor = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Parent Request:', request);
    // In a real app, you'd save this request. For now, navigate to a status page.
    navigate('/parent/request-status');
  };

  return (
    <div className="bg-neutral-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-white py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4 tracking-tight">
              Find Verified Tutors in Ethiopia. Fast.
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-neutral-600 mb-8">
              Connect with trusted, background-checked tutors for any subject. We bridge the "Trust Gap" so your child can get the help they need, safely.
            </p>
            <a href="#find-tutor-form" className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-transform transform hover:scale-105 inline-block">
              Get Started Now
            </a>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">A Simple Path to Academic Success</h2>
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-primary/20"></div>
              <div className="grid md:grid-cols-3 gap-12 relative">
                <div className="text-center">
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">1</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Submit Your Needs</h3>
                  <p className="text-neutral-500">Tell us the subject, grade, and your budget. It takes less than 2 minutes.</p>
                </div>
                <div className="text-center">
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">2</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Get AI-Powered Matches</h3>
                  <p className="text-neutral-500">Our smart system instantly finds the best-verified tutors for you.</p>
                </div>
                <div className="text-center">
                  <div className="mb-4 relative">
                     <div className="w-16 h-16 mx-auto rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">3</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connect & Learn</h3>
                  <p className="text-neutral-500">Chat with tutors, book a session, and watch your child thrive.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Parent Request Form Section */}
        <section id="find-tutor-form" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-neutral-200">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Find your ideal learning partner</h2>
              <p className="text-center text-neutral-500 mb-8">Fill out the details below to see your top tutor matches.</p>
              <form onSubmit={handleFindTutor} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700">Subject</label>
                    <select id="subject" name="subject" value={request.subject} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                   <div>
                    <label htmlFor="gradeLevel" className="block text-sm font-medium text-neutral-700">Student's Grade Level</label>
                    <select id="gradeLevel" name="gradeLevel" value={request.gradeLevel} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                      {GRADE_LEVELS.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Session Mode</label>
                    <div className="flex rounded-md shadow-sm">
                      <button type="button" onClick={() => handleModeChange('in-person')} className={`flex-1 px-4 py-2 text-sm rounded-l-md border ${request.mode === 'in-person' ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'}`}>In-Person</button>
                      <button type="button" onClick={() => handleModeChange('online')} className={`flex-1 px-4 py-2 text-sm rounded-r-md border-t border-b border-r ${request.mode === 'online' ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'}`}>Online</button>
                    </div>
                 </div>
                 {request.mode === 'in-person' && (
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-neutral-700">Location (Neighborhood/Area)</label>
                        <input type="text" name="location" id="location" value={request.location} onChange={handleInputChange} className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md" placeholder="e.g., Bole, Addis Ababa" />
                    </div>
                 )}
                 <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-neutral-700">Max Hourly Budget (ETB)</label>
                    <input type="range" min="100" max="2000" step="50" name="budget" id="budget" value={request.budget} onChange={handleInputChange} className="mt-1 w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                    <div className="text-center mt-2 font-semibold text-primary">ETB {request.budget} / hour</div>
                 </div>
                 <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">Additional Notes (Optional)</label>
                    <textarea id="notes" name="notes" rows={3} value={request.notes} onChange={handleInputChange} className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-neutral-300 rounded-md" placeholder="e.g., 'My child needs help with exam preparation for Grade 8 ministry.'"></textarea>
                 </div>
                 <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300">
                        Find a Tutor
                    </button>
                 </div>
              </form>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-neutral-100">
             <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose Hytor?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">ID Verification</h3>
                        <p className="text-neutral-500">Every tutor undergoes a mandatory National ID check, ensuring they are who they say they are.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">Location-Based Search</h3>
                        <p className="text-neutral-500">Find qualified tutors right in your neighborhood for convenient in-person sessions.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                        <p className="text-neutral-500">All transactions are handled securely through Chapa, Ethiopia's leading payment gateway.</p>
                    </div>
                </div>
            </div>
        </section>

         {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">Simple, Transparent Pricing for Tutors</h2>
                <p className="text-center text-neutral-500 mb-12">We only succeed when you do. Choose a plan that works for you.</p>
                <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Tier */}
                    <div className="border rounded-lg p-8 flex flex-col">
                        <h3 className="text-xl font-bold">Starter</h3>
                        <p className="mt-2 text-neutral-500">For tutors getting started.</p>
                        <p className="mt-6 text-4xl font-bold">Free</p>
                        <p className="font-semibold text-primary">20% Commission</p>
                        <ul className="mt-6 space-y-3 text-neutral-600 flex-grow">
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-secondary mr-2" />List up to 2 Gigs</li>
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-secondary mr-2" />Basic Profile</li>
                        </ul>
                        <button className="mt-8 w-full bg-neutral-100 text-neutral-800 font-semibold py-2 rounded-md">Get Started</button>
                    </div>
                    {/* Pro Tier */}
                    <div className="border-2 border-primary rounded-lg p-8 flex flex-col relative">
                        <p className="absolute top-0 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</p>
                        <h3 className="text-xl font-bold">Pro</h3>
                        <p className="mt-2 text-neutral-500">For established tutors.</p>
                        <p className="mt-6 text-4xl font-bold">ETB 299<span className="text-base font-normal">/mo</span></p>
                        <p className="font-semibold text-primary">15% Commission</p>
                        <ul className="mt-6 space-y-3 text-neutral-600 flex-grow">
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-secondary mr-2" />List up to 10 Gigs</li>
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-secondary mr-2" />Enhanced Profile</li>
                            <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-secondary mr-2" />Priority Support</li>
                        </ul>
                        <button className="mt-8 w-full bg-primary text-white font-semibold py-2 rounded-md">Choose Pro</button>
                    </div>
                    {/* Premium Tier */}
                    <div className="border rounded-lg p-8 flex flex-col">
                        <h3 className="text-xl font-bold">Premium</h3>
                        <p className="mt-2 text-neutral-500">For professional tutoring businesses.</p>
                        <p className="mt-6 text-4xl font-bold">ETB 599<span className="text-base font-normal">/mo</span></p>
                        <p className="font-semibold text-primary">10% Commission</p>
                        <ul className="mt-6 space-y-3 text-neutral-600 flex-grow">
                             <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-secondary mr-2" />Unlimited Gigs</li>
                             <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-secondary mr-2" />Featured Profile Badge</li>
                             <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-secondary mr-2" />Advanced Analytics</li>
                        </ul>
                        <button className="mt-8 w-full bg-neutral-100 text-neutral-800 font-semibold py-2 rounded-md">Choose Premium</button>
                    </div>
                </div>
            </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 bg-neutral-800 text-white">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="text-3xl font-bold mb-4">Our Goal</h2>
                <p className="text-lg text-neutral-300">
                    Hytor was born from a simple need: to create a safe and reliable bridge between parents seeking quality education for their children and qualified tutors looking for opportunities in Ethiopia. We are committed to building a community founded on trust, transparency, and a shared passion for learning. Our mission is to empower students by making top-tier tutoring accessible and to provide educators with the professional platform they deserve.
                </p>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
