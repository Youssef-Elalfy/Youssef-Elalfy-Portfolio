'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { pick, skillGroups, type Skill } from '@/data/expertise';
import { useI18n } from '@/components/i18n/I18nProvider';
import { localePath } from '@/i18n/config';
import { format } from '@/i18n';
import type { Project } from '@/types';
import { StatusBadge } from './StatusBadge';

/** The few project fields the evidence list needs, localized on the server. */
export type EvidenceProject = Pick<Project, 'id' | 'slug' | 'title' | 'category' | 'status' | 'accent'>;

const allSkills = skillGroups.flatMap(group => group.skills);

function EvidenceList({ skill, byId }: { skill: Skill; byId: Map<string, EvidenceProject> }) {
  const { locale, dict } = useI18n();
  const evidence = skill.evidence.map(id => byId.get(id)).filter(project => project !== undefined);
  return (
    <ul>
      {evidence.map(project => (
        <li key={project.id}>
          <Link href={localePath(locale, `/projects/${project.slug}`)} style={{ '--accent': project.accent ?? '#c8ff3d' } as React.CSSProperties}>
            <span className="evidence-title"><span dir="ltr">{project.title}</span></span>
            <span className="evidence-cat">{project.category}</span>
            <StatusBadge status={project.status} labels={dict.status} />
            <ArrowUpRight size={16} aria-hidden="true" className="flip-rtl" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ExpertiseExplorer({ projects }: { projects: EvidenceProject[] }) {
  const { locale, dict } = useI18n();
  const byId = new Map(projects.map(project => [project.id, project]));
  const t = dict.expertise;
  const [selected, setSelected] = useState<Skill>(allSkills[0]);
  const name = pick(selected.name, locale);
  const note = pick(selected.note, locale);

  return (
    <div className="expertise-grid">
      <div className="skill-groups">
        {skillGroups.map(group => (
          <section key={group.id} className="skill-group" aria-labelledby={`group-${group.id}`}>
            <h3 id={`group-${group.id}`}>{pick(group.title, locale)}</h3>
            <p>{pick(group.summary, locale)}</p>
            <ul className="chips">
              {group.skills.map(skill => (
                <li key={skill.id}>
                  <button type="button" aria-pressed={selected.id === skill.id} aria-controls="skill-evidence" onClick={() => setSelected(skill)}>
                    {pick(skill.name, locale)}
                    <span className="chip-count" aria-hidden="true">{skill.evidence.length}</span>
                    <span className="sr-only">{format(skill.evidence.length === 1 ? t.usedInOne : t.usedIn, { count: skill.evidence.length })}</span>
                  </button>
                </li>
              ))}
            </ul>
            {group.skills.includes(selected) && (
              <div className="evidence-inline" aria-live="polite">
                <p className="evidence-note"><b>{name}</b> — {note}</p>
                <EvidenceList skill={selected} byId={byId} />
              </div>
            )}
          </section>
        ))}
      </div>

      <aside id="skill-evidence" className="evidence" aria-live="polite" aria-labelledby="evidence-title">
        <p className="evidence-label">{t.where}</p>
        <h3 id="evidence-title">{name}</h3>
        <p className="evidence-note">{note}</p>
        <EvidenceList skill={selected} byId={byId} />
        <p className="evidence-foot">{t.foot}</p>
      </aside>
    </div>
  );
}
