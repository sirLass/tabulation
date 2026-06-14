"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface Toast {
    id: number;
    message: string;
    type: "success" | "error";
}

interface ToastCtx {
    toast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} });

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: "success" | "error" = "success") => {
        const id = nextId++;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`px-5 py-3 rounded-lg shadow-lg text-sm font-body animate-fade-in-up border backdrop-blur-md transition-all duration-300 ${t.type === "success"
                                ? "bg-green-900/60 border-green-500/30 text-green-300"
                                : "bg-red-900/60 border-red-500/30 text-red-300"
                            }`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
