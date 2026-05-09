import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface DescriptionPanelProps {
  description: string;
}

export function DescriptionPanel({ description }: DescriptionPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ borderColor: 'var(--accent-amber-border)' }}>
      <div className="card-header">
        <div className="card-icon card-icon-amber">📄</div>
        <div style={{ flex: 1 }}>
          <div className="card-title">SEO Business Description</div>
          <div className="card-subtitle">landing page ready</div>
        </div>
        <button
          id="copy-desc-btn"
          className={`btn-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Copied!' : '⎘ Copy Description'}
        </button>
      </div>

      <div className="description-paragraphs markdown-body">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>

      <div style={{
        marginTop: '16px',
        padding: '10px 14px',
        background: 'var(--accent-amber-dim)',
        border: '1px solid var(--accent-amber-border)',
        borderRadius: '8px',
        fontSize: '0.78rem',
        color: 'var(--accent-amber)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>💡</span>
        <span>
          Use this as your Google Business "Business description" or your website's About section.
        </span>
      </div>
    </div>
  );
}
