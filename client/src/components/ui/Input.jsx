import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <input
                type={type}
                className={twMerge(
                    clsx(
                        'flex h-12 w-full rounded-xl border border-white/10 bg-surface/50 px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-text-main transition-all duration-200',
                        error && 'border-danger focus-visible:ring-danger',
                        className
                    )
                )}
                ref={ref}
                {...props}
            />
            {error && <span className="mt-1 text-sm text-danger">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
