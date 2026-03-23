import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Award, Loader2 } from 'lucide-react';
import { Expertise } from '@/types';
import { useCreateExpertise } from '@/features/auth/hooks';

interface ExpertiseSelectorProps {
    allExpertise: Expertise[];
    selectedExpertiseIds: number[];
    onToggle: (id: number) => void;
    disabled?: boolean;
}

const ExpertiseSelector: React.FC<ExpertiseSelectorProps> = ({ allExpertise, selectedExpertiseIds, onToggle, disabled }) => {
    const [search, setSearch] = useState('');
    const { mutateAsync: createExpertise, isPending: creating } = useCreateExpertise();

    const filteredExpertise = useMemo(() => {
        if (!search) return [];
        return allExpertise.filter(e =>
            e.name.toLowerCase().includes(search.toLowerCase()) &&
            !selectedExpertiseIds.includes(e.id)
        ).slice(0, 5);
    }, [allExpertise, search, selectedExpertiseIds]);

    const showCreateOption = useMemo(() => {
        if (!search || search.length < 2) return false;
        const exactMatch = allExpertise.find(e => e.name.toLowerCase() === search.toLowerCase());
        return !exactMatch;
    }, [allExpertise, search]);

    const selectedExpertise = useMemo(() => {
        return allExpertise.filter(e => selectedExpertiseIds.includes(e.id));
    }, [allExpertise, selectedExpertiseIds]);

    const handleCreate = async () => {
        try {
            const newExpertise = await createExpertise(search);
            onToggle(newExpertise.id);
            setSearch('');
        } catch (err) {
            console.error("Failed to create expertise", err);
        }
    };

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
                        placeholder="Search or add new expertise..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-xs font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />

                    {search && (filteredExpertise.length > 0 || showCreateOption) && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {filteredExpertise.map(e => (
                                <button
                                    key={e.id}
                                    type="button"
                                    onClick={() => {
                                        onToggle(e.id);
                                        setSearch('');
                                    }}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-secondary/5 rounded-lg flex items-center justify-center">
                                            <Award className="w-4 h-4 text-secondary" />
                                        </div>
                                        <span className="text-xs font-black text-neutral-900">{e.name}</span>
                                    </div>
                                    <Plus className="w-4 h-4 text-neutral-300 group-hover:text-secondary transition-colors" />
                                </button>
                            ))}

                            {showCreateOption && (
                                <button
                                    type="button"
                                    onClick={handleCreate}
                                    disabled={creating}
                                    className="w-full px-6 py-4 flex items-center justify-between bg-secondary/5 hover:bg-secondary/10 transition-colors group border-t border-secondary/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-secondary text-white rounded-lg flex items-center justify-center shadow-lg shadow-secondary/20">
                                            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-secondary uppercase tracking-widest leading-none mb-1">Create New</p>
                                            <p className="text-xs font-black text-neutral-900">"{search}"</p>
                                        </div>
                                    </div>
                                    {!creating && <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-secondary/20">Add +</span>}
                                </button>
                            )}
                        </div>
                    )}

                    {search && filteredExpertise.length === 0 && !showCreateOption && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-100 rounded-2xl shadow-xl p-6 text-center animate-in fade-in slide-in-from-top-2 duration-200">
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">No matching expertise found</p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {selectedExpertise.map(e => (
                    <div
                        key={e.id}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl animate-in zoom-in duration-200"
                    >
                        <span className="text-[10px] font-black uppercase tracking-tight">{e.name}</span>
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => onToggle(e.id)}
                                className="p-0.5 hover:bg-secondary/20 rounded-md transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}
                {selectedExpertise.length === 0 && (
                    <div className="text-[10px] font-bold text-neutral-400 italic py-2">
                        No expertise selected yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpertiseSelector;
