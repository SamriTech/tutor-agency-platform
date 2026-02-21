import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RegisterPayload } from "@/features/auth/types";
import { Role } from "@/types";
interface SignupState {
    registrationData: Partial<RegisterPayload>;
    setRegistrationData: (data: Partial<RegisterPayload>) => void;
    setRole: (role: Role) => void;
    resetSignup: () => void;
}

export const useSignupStore = create<SignupState>()(
    immer((set) => ({
        registrationData: {
            role: Role.Student,
        },
        setRegistrationData: (data) =>
            set((state) => {
                state.registrationData = { ...state.registrationData, ...data };
            }),
        setRole: (role) =>
            set((state) => {
                state.registrationData.role = role;
            }),
        resetSignup: () =>
            set((state) => {
                state.registrationData = { role: Role.Student };
            }),
    }))
);
