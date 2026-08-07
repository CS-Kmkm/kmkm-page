import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`w-[90%] max-w-7xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}
