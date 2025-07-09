import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95 relative overflow-hidden',
          {
            'btn-colorful text-white hover:shadow-xl hover:-translate-y-1':
              variant === 'default',
            'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 hover:shadow-xl hover:-translate-y-1':
              variant === 'destructive',
            'btn-light hover:shadow-xl hover:-translate-y-1':
              variant === 'outline',
            'bg-white/90 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-xl hover:-translate-y-1':
              variant === 'secondary',
            'bg-white/50 text-gray-700 hover:bg-white/80 hover:shadow-lg': variant === 'ghost',
            'text-gray-700 underline-offset-4 hover:underline gradient-text': variant === 'link',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-12 rounded-lg px-8 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
