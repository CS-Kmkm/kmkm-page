'use client';

import RelatedTechnologies from './RelatedTechnologies';
import type { TechItem } from '@/types';

interface RelatedLanguagesProps {
  languages: TechItem[];
  onLanguageSelect?: (language: TechItem) => void;
}

export default function RelatedLanguages({
  languages,
  onLanguageSelect,
}: RelatedLanguagesProps) {
  return (
    <RelatedTechnologies
      title="関連言語"
      technologies={languages}
      onSelect={onLanguageSelect}
    />
  );
}
