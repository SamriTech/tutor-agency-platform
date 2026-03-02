import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import TutorCard from '../../components/cards/TutorCard';
import { TUTORS } from '../../backend/frontend/constants';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const FindTutorsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [selectedGrade, setSelectedGrade] = useState('All Grades');

    const subjects = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Programming'];
    const grades = ['All Grades', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'University'];

    const filteredTutors = TUTORS.filter(tutor => {
        const matchesQuery = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesSubject = selectedSubject === 'All Subjects' || tutor.subjects.includes(selectedSubject);
        // Assuming grade might be in bio or just filtering by subject for now as MOCK_TUTORS don't have explicit grade list
        return matchesQuery && matchesSubject;
    });

    const categories = [
        { name: 'Mathematics', icon: '📐' },
        { name: 'Science', icon: '🧬' },
        { name: 'Languages', icon: '🌍' },
        { name: 'Programming', icon: '💻' },
        { name: 'Art', icon: '🎨' },
        { name: 'Music', icon: '🎸' }
    ];

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />

            {/* Hero Search Section */}
            <section className="bg-primary/5 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                        Find the perfect <span className="text-primary italic">tutor</span> for your needs
                    </h1>
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden border border-neutral-200 bg-white">
                            <div className="flex-grow flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-neutral-100">
                                <SearchIcon className="w-5 h-5 text-neutral-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder='Search for any subject (e.g. "Calculus")'
                                    className="w-full focus:outline-none text-neutral-800"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-neutral-100 bg-neutral-50/50">
                                <select
                                    className="bg-transparent focus:outline-none text-neutral-700 font-medium cursor-pointer"
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                >
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <button className="bg-primary text-white font-bold px-8 py-4 hover:bg-primary-dark transition-colors shrink-0">
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-sm text-neutral-500">
                        <span className="font-semibold">Popular:</span>
                        {['Mathematics', 'Physics', 'English', 'Python'].map(topic => (
                            <button
                                key={topic}
                                onClick={() => setSearchQuery(topic)}
                                className="px-3 py-1 border border-neutral-300 rounded-full hover:border-primary hover:text-primary transition-all"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Pills */}
            <div className="border-b border-neutral-200 sticky top-[72px] bg-white z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-8 overflow-x-auto no-scrollbar py-4">
                        {categories.map(cat => (
                            <button key={cat.name} className="flex items-center space-x-2 whitespace-nowrap text-neutral-600 hover:text-primary transition-colors group">
                                <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                                <span className="font-medium">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">{filteredTutors.length} services available</h2>
                        <p className="text-neutral-500">Showing top-rated verified tutors in Ethiopia</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <button className="flex items-center space-x-2 border border-neutral-300 px-4 py-2 rounded-lg hover:border-neutral-900 transition-colors">
                                <span className="font-semibold">Sort by: Relevancy</span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {filteredTutors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredTutors.map(tutor => (
                            <TutorCard key={tutor.id} tutor={tutor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">No tutors found</h3>
                        <p className="text-neutral-500 max-w-sm mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedSubject('All Subjects'); }}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default FindTutorsPage;
