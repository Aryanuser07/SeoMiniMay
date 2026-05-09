import { useState } from 'react';
import type { Keywords } from '../types';

interface KeywordsPanelProps {
  keywords: Keywords;
}

export function KeywordsPanel({ keywords }: KeywordsPanelProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const allKeywords = [...keywords.high_intent, ...keywords.informational];

  const copyAll = async () => {
    await navigator.clipboard.writeText(allKeywords.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon card-icon-violet">🔑</div>
        <div style={{ flex: 1 }}>
          <div className="card-title">SEO Keywords</div>
          <div className="card-subtitle">{allKeywords.length} keywords · grouped by intent</div>
        </div>
        <button
          id="copy-keywords-btn"
          className={`btn-copy ${copiedAll ? 'copied' : ''}`}
          onClick={copyAll}
        >
          {copiedAll ? '✓ Copied!' : '⎘ Copy All'}
        </button>
      </div>

      {/* High Intent */}
      <div className="keywords-section">
        <div className="keywords-section-label">
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--accent-violet)', display: 'inline-block'
          }} />
          <span className="label-violet">High Intent</span>
          <span className="text-muted text-sm">— transactional & conversion-focused</span>
        </div>
        <div className="keywords-grid">
          {keywords.high_intent.map((kw, i) => (
            <span key={i} className="keyword-tag keyword-tag-violet" title="Click to copy">
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Informational */}
      <div className="keywords-section">
        <div className="keywords-section-label">
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--accent-teal)', display: 'inline-block'
          }} />
          <span className="label-teal">Informational</span>
          <span className="text-muted text-sm">— awareness & education keywords</span>
        </div>
        <div className="keywords-grid">
          {keywords.informational.map((kw, i) => (
            <span key={i} className="keyword-tag keyword-tag-teal" title="Click to copy">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
