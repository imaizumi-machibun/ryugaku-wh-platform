import type { Experience } from '@/lib/microcms/types';
import { getPurposePath, PURPOSE_LABELS } from '@/lib/experiences/classification';

export type BreadcrumbEntry = { name: string; url: string };

export function buildExperienceBreadcrumb(experience: Experience): BreadcrumbEntry[] {
  const purposePath = getPurposePath(experience);
  const purposeLabel =
    experience.primaryPurpose === 'working-holiday' || experience.primaryPurpose === 'study-abroad'
      ? PURPOSE_LABELS[experience.primaryPurpose]
      : null;
  if (purposePath && purposeLabel) {
    return [
      { name: 'ホーム', url: '/' },
      { name: '国一覧', url: '/countries' },
      { name: experience.country.nameJp, url: `/countries/${experience.country.id}` },
      { name: `${experience.country.nameJp}${purposeLabel}`, url: purposePath },
      { name: experience.title, url: `/experiences/${experience.id}` },
    ];
  }
  return [
    { name: 'ホーム', url: '/' },
    { name: '体験談', url: '/experiences' },
    { name: experience.title, url: `/experiences/${experience.id}` },
  ];
}
export function toVisibleBreadcrumbItems(entries: BreadcrumbEntry[]) {
  return entries.slice(1).map((entry, index, items) => ({
    label: entry.name,
    ...(index < items.length - 1 ? { href: entry.url } : {}),
  }));
}
