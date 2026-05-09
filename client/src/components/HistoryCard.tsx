import { useState } from 'react';
import type { Project } from '../types';
import { KeywordsPanel } from './KeywordsPanel';
import { GMBPostPanel } from './GMBPostPanel';
import { DescriptionPanel } from './DescriptionPanel';

interface HistoryCardProps {
  project: Project;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function HistoryCard({ project }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const keywordCount = project.outputs
    ? project.outputs.keywords.high_intent.length + project.outputs.keywords.informational.length
    : 0;

  return (
    <>
      <div
        className="history-card"
        id={`history-card-${project.id}`}
        onClick={() => setExpanded(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setExpanded(true)}
      >
        <div className="history-card-header">
          <div className="history-card-name">{project.businessName}</div>
          <div className="history-card-badge">{project.category.split(' / ')[0]}</div>
        </div>

        <div className="history-card-meta">
          <span>📍</span>
          <span>{project.location}</span>
          <span style={{ margin: '0 4px', color: 'var(--border-hover)' }}>·</span>
          <span>🕐</span>
          <span>{formatDate(project.createdAt)}</span>
        </div>

        {project.outputs && (
          <div className="history-card-preview">
            {project.outputs.gmbPost.substring(0, 120)}…
          </div>
        )}

        <div className="history-card-footer">
          <span className="history-keyword-count">🔑 {keywordCount} keywords</span>
          <span className="history-arrow">→</span>
        </div>
      </div>

      {/* Detail Modal */}
      {expanded && project.outputs && (
        <div
          className="modal-overlay"
          onClick={e => e.target === e.currentTarget && setExpanded(false)}
        >
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.3rem', fontWeight: 700 }}>
                  {project.businessName}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {project.category} · {project.location} · {formatDate(project.createdAt)}
                </p>
              </div>
              <button
                className="modal-close"
                id={`close-modal-${project.id}`}
                onClick={() => setExpanded(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <KeywordsPanel keywords={project.outputs.keywords} />
              <GMBPostPanel post={project.outputs.gmbPost} />
              <DescriptionPanel description={project.outputs.seoDescription} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
