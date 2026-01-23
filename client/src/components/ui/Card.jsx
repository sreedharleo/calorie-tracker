import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={twMerge(
                clsx(
                    'bg-surface/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl',
                    className
                )
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
