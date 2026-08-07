interface PageHeadingProps {
  children: string;
  compact?: boolean;
  className?: string;
}

export default function PageHeading({
  children,
  compact = false,
  className = '',
}: PageHeadingProps) {
  const size = compact ? 'text-xl sm:text-2xl md:text-3xl' : 'text-2xl sm:text-3xl';

  return (
    <h1 className={`${size} font-bold text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </h1>
  );
}
