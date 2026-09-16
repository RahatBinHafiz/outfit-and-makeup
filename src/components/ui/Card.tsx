import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: 'default' | 'warm' | 'yellow' | 'paleYellow';
  padded?: boolean;
}

const variantStyles = {
  default: 'bg-white border-[#EAE7DD] shadow-[0_2px_12px_rgba(37,37,37,0.04)]',
  warm: 'bg-[#FFFDF5] border-[#EAE7DD] shadow-[0_2px_12px_rgba(37,37,37,0.04)]',
  yellow: 'bg-[#FFF4BF] border-[#FFD84D] shadow-sm',
  paleYellow: 'bg-[#FFF9E6] border-[#EAE7DD] shadow-sm',
};

export default function Card({
  variant = 'default',
  padded = true,
  className = '',
  children,
  id,
  ...props
}: CardProps) {
  return (
    <div
      id={id}
      className={`rounded-2xl border transition-all duration-200 ${variantStyles[variant]} ${
        padded ? 'p-5 sm:p-6' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
