'use client';

import RelatedTechnologies from './RelatedTechnologies';
import type { TechItem } from '@/types';

interface RelatedFrameworksProps {
  frameworks: TechItem[];
  onFrameworkSelect?: (framework: TechItem) => void;
}

export default function RelatedFrameworks({
  frameworks,
  onFrameworkSelect,
}: RelatedFrameworksProps) {
  return (
    <RelatedTechnologies
      title="関連フレームワーク"
      technologies={frameworks}
      onSelect={onFrameworkSelect}
    />
  );
}
