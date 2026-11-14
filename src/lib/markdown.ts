import {
  getLocalizedProfile, getLocalizedCareerEntries, getLocalizedEvents,
  getLocalizedPublications, getLocalizedTechExperience, getLocalizedProjectDetails,
  getLocalizedUpdates, type ContentLocale,
} from '@/data/localized';

export const markdownPages = ['', 'career', 'publications', 'dev-experience'] as const;
export type MarkdownPage = typeof markdownPages[number];

// Escape prose rather than allowing source text to introduce HTML or Markdown structure.
export function prose(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/([\\`*_[\]{}()#!|])/g, '\\$1');
}

function link(label: string, url: string): string {
  if (!/^https?:\/\//i.test(url) && !/^\/(?!\/)/.test(url)) return prose(label);
  return `[${prose(label)}](${url.replace(/[\s()<>\\]/g, char => encodeURIComponent(char))})`;
}

export function prefersMarkdown(accept: string | null): boolean {
  const ranges = (accept ?? '').toLowerCase().split(',').map(item => {
    const [type, ...params] = item.trim().split(';');
    const q = params.find(param => param.trim().startsWith('q='));
    const quality = q ? Number(q.trim().slice(2)) : 1;
    return { type, quality: Number.isFinite(quality) && quality >= 0 && quality <= 1 ? quality : 0 };
  });
  const markdown = Math.max(0, ...ranges.filter(item => item.type === 'text/markdown').map(item => item.quality));
  // HTML is the default, including wildcard-only requests. Explicit Markdown wins ties.
  const html = ranges.find(item => item.type === 'text/html')
    ?? ranges.find(item => item.type === 'text/*') ?? ranges.find(item => item.type === '*/*');
  return markdown > 0 && markdown >= (html?.quality ?? 0);
}

export function renderMarkdown(locale: ContentLocale, page: MarkdownPage): string {
  const en = locale === 'en';
  const profile = getLocalizedProfile(locale);
  const titles = en ? ['Profile', 'Career', 'Publications', 'Development Experience'] : ['プロフィール', '経歴', '論文', '開発経験'];
  const lines = [`# ${prose(profile.name)} — ${titles[markdownPages.indexOf(page)]}`, ''];
  const section = (title: string, body: (string | undefined)[]) => {
    lines.push(`## ${prose(title)}`, '', ...body.filter((item): item is string => !!item), '');
  };
  if (page === '') {
    lines.push(...[profile.currentAffiliation, profile.currentPosition, profile.researchInterests, profile.bio].filter(Boolean).map(item => prose(item!)), '');
    lines.push(...profile.socialLinks.map(item => `- ${link(item.username ?? item.platform, item.url)}`), '');
    section(en ? 'Updates' : '更新情報', getLocalizedUpdates(locale).map(item => `- ${item.date}: ${prose(item.title)} — ${prose(item.description)}`));
  } else if (page === 'career') {
    for (const entry of getLocalizedCareerEntries(locale)) {
      section(`${entry.organization} — ${entry.role}`, [
        `${entry.startDate} – ${entry.endDate ?? (en ? 'Present' : '現在')}`,
        entry.description && prose(entry.description),
      ]);
    }
    section(en ? 'Activities' : '活動', getLocalizedEvents(locale).map(item =>
      `- ${item.date}: ${prose(item.title)} — ${prose(item.description)}${item.publicationLinks?.map(ref => ` ${link(ref.title, ref.url)}`).join('') ?? ''}`));
  } else if (page === 'publications') {
    for (const item of getLocalizedPublications(locale)) {
      section(item.title, [prose(item.authors.join(', ')), `${prose(item.venue)} (${item.year})`,
        item.doi && link(`DOI: ${item.doi}`, `https://doi.org/${item.doi}`),
        item.url && link(en ? 'Source' : '掲載元', item.url),
        item.abstract && prose(item.abstract),
        ...item.awards?.map(award => prose(award.title)) ?? [],
      ]);
    }
  } else {
    for (const tech of getLocalizedTechExperience(locale).filter(item => item.showOnWeb !== false)) {
      section(tech.name, [tech.description && prose(tech.description),
        `${en ? 'Experience' : '経験年数'}: ${tech.experienceYears} ${en ? 'years' : '年'}`]);
    }
    for (const project of getLocalizedProjectDetails(locale)) {
      section(project.name, [prose(project.description), prose(project.duration), prose(project.role),
        prose(project.technologies.join(', ')), project.url && link(en ? 'Project' : 'プロジェクト', project.url),
        project.githubUrl && link('GitHub', project.githubUrl)]);
    }
  }
  return `${lines.join('\n').trim()}\n`;
}

export function renderMarkdown404(locale: ContentLocale): string {
  const labels = locale === 'en' ? ['Home', 'Career', 'Publications', 'Development Experience'] : ['ホーム', '経歴', '論文', '開発経験'];
  return `# 404 — ${locale === 'en' ? 'Page not found' : 'ページが見つかりません'}\n\n${
    locale === 'en' ? 'The requested page does not exist. Available pages:' : '指定されたページは存在しません。以下のページをご利用ください。'
  }\n\n${markdownPages.map((page, index) => `- ${link(labels[index], `/${locale}${page ? `/${page}` : ''}`)}`).join('\n')}\n`;
}
