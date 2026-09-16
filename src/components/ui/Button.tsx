import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'yellowLight';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FFD84D] text-[#252525] font-semibold hover:bg-[#FACC15] active:scale-[0.98] shadow-sm border border-[#F5CD3D]',
  secondary:
    'bg-[#FFF9E6] text-[#252525] font-semibold border border-[#EAE7DD] hover:bg-[#FFF4BF] active:scale-[0.98]',
  outline:
    'bg-white text-[#252525] font-medium border border-[#EAE7DD] hover:border-[#252525] hover:bg-[#FFFDF5] active:scale-[0.98]',
  ghost:
    'bg-transparent text-[#252525] hover:bg-[#FFF9E6] active:bg-[#FFF4BF]',
  yellowLight:
    'bg-[#FFF4BF] text-[#252525] font-semibold border border-[#FFD84D]/40 hover:bg-[#FFD84D]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5 min-h-[34px]',
  md: 'text-sm px-5 py-2.5 rounded-full gap-2 min-h-[42px]',
  lg: 'text-base px-6 py-3 rounded-full gap-2.5 min-h-[48px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  children,
  id,
  ...props
}: ButtonProps) {
  return (
    <button
      id={id}
      className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
