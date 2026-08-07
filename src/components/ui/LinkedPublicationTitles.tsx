import type { ReactNode } from 'react';
import type { PublicationLink } from '@/types';

interface LinkedPublicationTitlesProps {
  text: string;
  links?: PublicationLink[];
}

interface TitleMatch {
  start: number;
  end: number;
  link: PublicationLink;
}

function findTitleMatches(text: string, links: PublicationLink[]): TitleMatch[] {
  const matches = links.flatMap(link => {
    if (!link.title) return [];

    const titleMatches: TitleMatch[] = [];
    let start = text.indexOf(link.title);

    while (start !== -1) {
      titleMatches.push({
        start,
        end: start + link.title.length,
        link,
      });
      start = text.indexOf(link.title, start + link.title.length);
    }

    return titleMatches;
  });

  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  const nonOverlappingMatches: TitleMatch[] = [];
  let nextAvailableIndex = 0;

  matches.forEach(match => {
    if (match.start >= nextAvailableIndex) {
      nonOverlappingMatches.push(match);
      nextAvailableIndex = match.end;
    }
  });

  return nonOverlappingMatches;
}

export default function LinkedPublicationTitles({ text, links = [] }: LinkedPublicationTitlesProps) {
  const matches = findTitleMatches(text, links);
  if (matches.length === 0) return text;

  const content: ReactNode[] = [];
  let cursor = 0;

  matches.forEach(match => {
    if (match.start > cursor) {
      content.push(text.slice(cursor, match.start));
    }

    content.push(
      <a
        key={`${match.link.url}-${match.start}`}
        href={match.link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
        onClick={event => event.stopPropagation()}
        onKeyDown={event => event.stopPropagation()}
      >
        {match.link.title}
      </a>
    );
    cursor = match.end;
  });

  if (cursor < text.length) {
    content.push(text.slice(cursor));
  }

  return content;
}
