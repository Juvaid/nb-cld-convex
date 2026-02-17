'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
    const [visible, setVisible] = useState(true);

    const close = useCallback(() => {
        setVisible(false);
        setTimeout(() => onClose?.(), 300);
    }, [onClose]);

    useEffect(() => {
        const timer = setTimeout(close, duration);
        return () => clearTimeout(timer);
    }, [duration, close]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl ${bgColors[type]}`}>
                {icons[type]}
                <span className="text-sm font-semibold text-gray-800">{message}</span>
                <button onClick={close} className="ml-2 p-1 rounded-lg hover:bg-black/5 transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </div>
    );
}

// Hook for easy toast management
export function useToast() {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const ToastContainer = () => (
        <div className="fixed bottom-6 right-6 z-[100] space-y-3">
            {toasts.map((toast, i) => (
                <div key={toast.id} style={{ transform: `translateY(-${i * 4}px)` }}>
                    <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                </div>
            ))}
        </div>
    );

    return { showToast, ToastContainer };
}
