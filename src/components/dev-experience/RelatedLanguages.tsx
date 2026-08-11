'use client';

import RelatedTechnologies from './RelatedTechnologies';
import type { TechItem } from '@/types';
import { useI18n } from '@/lib/i18n';

interface RelatedLanguagesProps {
  languages: TechItem[];
  onLanguageSelect?: (language: TechItem) => void;
}

export default function RelatedLanguages({
  languages,
  onLanguageSelect,
}: RelatedLanguagesProps) {
  const { messages } = useI18n();
  return (
    <RelatedTechnologies
      title={messages.relatedLanguages}
      technologies={languages}
      onSelect={onLanguageSelect}
    />
  );
}
