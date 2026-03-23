import { create } from 'zustand';

interface TutorFilterState {
    searchQuery: string;
    selectedSubject: number | null;
    location: string;
    setSearchQuery: (query: string) => void;
    setSelectedSubject: (subjectId: number | null) => void;
    setLocation: (location: string) => void;
    resetFilters: () => void;
}

export const useTutorFilterStore = create<TutorFilterState>((set) => ({
    searchQuery: '',
    selectedSubject: null,
    location: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedSubject: (subjectId) => set({ selectedSubject: subjectId }),
    setLocation: (location) => set({ location: location }),
    resetFilters: () => set({ searchQuery: '', selectedSubject: null, location: '' }),
}));
