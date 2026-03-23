import React, { useState, useMemo } from 'react';
import { Search, X, Plus, BookOpen } from 'lucide-react';
import { Subject } from '@/types';

interface SubjectSelectorProps {
    allSubjects: Subject[];
    selectedSubjectIds: number[];
    onToggle: (id: number) => void;
    disabled?: boolean;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ allSubjects, selectedSubjectIds, onToggle, disabled }) => {
    const [search, setSearch] = useState('');

    const filteredSubjects = useMemo(() => {
        if (!search) return [];
        return allSubjects.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) &&
            !selectedSubjectIds.includes(s.id)
        ).slice(0, 5);
    }, [allSubjects, search, selectedSubjectIds]);

    const selectedSubjects = useMemo(() => {
        return allSubjects.filter(s => selectedSubjectIds.includes(s.id));
    }, [allSubjects, selectedSubjectIds]);

    return (
        <div className="space-y-4">
            {!disabled && (
                <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search and add subjects (e.g. Mathematics, Physics...)"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-xs font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />

                    {search && filteredSubjects.length > 0 && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {filteredSubjects.map(s => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
                                        onToggle(s.id);
                                        setSearch('');
                                    }}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-xs font-black text-neutral-900">{s.name}</span>
                                    </div>
                                    <Plus className="w-4 h-4 text-neutral-300 group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}

                    {search && filteredSubjects.length === 0 && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-100 rounded-2xl shadow-xl p-6 text-center animate-in fade-in slide-in-from-top-2 duration-200">
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">No matching subjects found</p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {selectedSubjects.map(s => (
                    <div
                        key={s.id}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-xl animate-in zoom-in duration-200"
                    >
                        <span className="text-[10px] font-black uppercase tracking-tight">{s.name}</span>
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => onToggle(s.id)}
                                className="p-0.5 hover:bg-primary/20 rounded-md transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}
                {selectedSubjects.length === 0 && (
                    <div className="text-[10px] font-bold text-neutral-400 italic py-2">
                        No subjects selected yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectSelector;
