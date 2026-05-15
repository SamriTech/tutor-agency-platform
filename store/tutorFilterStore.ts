import { create } from 'zustand';

interface TutorFilterState {
    searchQuery: string;
    selectedSubject: number | null;
    selectedGrade: number | null;
    minRate: string;
    maxRate: string;
    location: string;
    availability: string[];
    setSearchQuery: (query: string) => void;
    setSelectedSubject: (subjectId: number | null) => void;
    setSelectedGrade: (gradeId: number | null) => void;
    setMinRate: (rate: string) => void;
    setMaxRate: (rate: string) => void;
    setLocation: (location: string) => void;
    toggleAvailability: (option: string) => void;
    resetFilters: () => void;
}

export const useTutorFilterStore = create<TutorFilterState>((set) => ({
    searchQuery: '',
    selectedSubject: null,
    selectedGrade: null,
    minRate: '',
    maxRate: '',
    location: '',
    availability: [],
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedSubject: (subjectId) => set({ selectedSubject: subjectId }),
    setSelectedGrade: (gradeId) => set({ selectedGrade: gradeId }),
    setMinRate: (rate) => set({ minRate: rate }),
    setMaxRate: (rate) => set({ maxRate: rate }),
    setLocation: (location) => set({ location: location }),
    toggleAvailability: (option) => set((state) => ({
        availability: state.availability.includes(option)
            ? state.availability.filter((a) => a !== option)
            : [...state.availability, option],
    })),
    resetFilters: () => set({
        searchQuery: '',
        selectedSubject: null,
        selectedGrade: null,
        minRate: '',
        maxRate: '',
        location: '',
        availability: []
    }),
}));
