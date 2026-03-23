import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast: React.FC = () => {
    const { message, type, isVisible, hideNotification } = useNotificationStore();
    const [shouldRender, setShouldRender] = useState(isVisible);

    useEffect(() => {
        if (isVisible) setShouldRender(true);
    }, [isVisible]);

    const onAnimationEnd = () => {
        if (!isVisible) setShouldRender(false);
    };

    if (!shouldRender) return null;

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-100',
        error: 'bg-red-50 border-red-100',
        info: 'bg-blue-50 border-blue-100',
    };

    return (
        <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] min-w-[320px] max-w-md transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
                }`}
            onTransitionEnd={onAnimationEnd}
        >
            <div className={`flex items-center gap-4 p-4 rounded-3xl border shadow-2xl shadow-neutral-900/10 ${bgColors[type]}`}>
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <div className="flex-1">
                    <p className="text-xs font-black text-neutral-900 uppercase tracking-widest leading-none mb-1">
                        {type === 'success' ? 'Perfect' : type === 'error' ? 'Something went wrong' : 'Information'}
                    </p>
                    <p className="text-[13px] font-bold text-neutral-600 leading-tight">
                        {message}
                    </p>
                </div>
                <button
                    onClick={hideNotification}
                    className="p-1 hover:bg-white/50 rounded-full transition-colors"
                >
                    <X className="w-4 h-4 text-neutral-400" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
