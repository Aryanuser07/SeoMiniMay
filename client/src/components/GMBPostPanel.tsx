import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface GMBPostPanelProps {
  post: string;
}

export function GMBPostPanel({ post }: GMBPostPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = post.split(/\s+/).filter(Boolean).length;

  return (
    <div className="card" style={{ borderColor: 'var(--accent-teal-border)' }}>
      <div className="card-header">
        <div className="card-icon card-icon-teal">📝</div>
        <div style={{ flex: 1 }}>
          <div className="card-title">Google Business Post</div>
          <div className="card-subtitle">{wordCount} words · ready to publish</div>
        </div>
        <button
          id="copy-gmb-btn"
          className={`btn-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Copied!' : '⎘ Copy Post'}
        </button>
      </div>

      <div className="gmb-post-text markdown-body">
        <ReactMarkdown>{post}</ReactMarkdown>
      </div>

      <div style={{
        marginTop: '12px',
        padding: '10px 14px',
        background: 'var(--accent-teal-dim)',
        border: '1px solid var(--accent-teal-border)',
        borderRadius: '8px',
        fontSize: '0.78rem',
        color: 'var(--accent-teal)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>💡</span>
        <span>
          Paste this directly into your Google Business Profile → Posts → "What's new"
        </span>
      </div>
    </div>
  );
}
