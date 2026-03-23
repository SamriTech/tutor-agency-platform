import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
    message: string;
    type: NotificationType;
    isVisible: boolean;
    showNotification: (message: string, type: NotificationType) => void;
    hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    message: '',
    type: 'success',
    isVisible: false,
    showNotification: (message, type) => {
        set({ message, type, isVisible: true });
        // Auto-hide after 5 seconds
        setTimeout(() => {
            set({ isVisible: false });
        }, 5000);
    },
    hideNotification: () => set({ isVisible: false }),
}));
