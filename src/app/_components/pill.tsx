import React from 'react';

export function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-block bg-gray-200 rounded-full ml-3 px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
            {children}
        </span>
    );
}