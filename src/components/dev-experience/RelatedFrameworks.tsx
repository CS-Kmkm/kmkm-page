'use client';

import RelatedTechnologies from './RelatedTechnologies';
import type { TechItem } from '@/types';
import { useI18n } from '@/lib/i18n';

interface RelatedFrameworksProps {
  frameworks: TechItem[];
  onFrameworkSelect?: (framework: TechItem) => void;
}

export default function RelatedFrameworks({
  frameworks,
  onFrameworkSelect,
}: RelatedFrameworksProps) {
  const { messages } = useI18n();
  return (
    <RelatedTechnologies
      title={messages.relatedFrameworks}
      technologies={frameworks}
      onSelect={onFrameworkSelect}
    />
  );
}
