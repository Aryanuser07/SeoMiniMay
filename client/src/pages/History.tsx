import { useEffect, useState } from 'react';
import { getHistory } from '../services/api';
import type { Project } from '../types';
import { HistoryCard } from '../components/HistoryCard';

interface HistoryProps {
  onNavigateToGenerate: () => void;
}

export function History({ onNavigateToGenerate }: HistoryProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getHistory();
        setProjects(data);
      } catch {
        setError('Failed to load history. Make sure the server is running.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="history-header">
          <div>
            <h1 className="history-title">Generation History</h1>
            <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
              All your past AI-generated SEO content
            </p>
          </div>
          <button className="btn btn-primary" onClick={onNavigateToGenerate}>
            ✨ New Generation
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px', width: '32px', height: '32px', borderWidth: '3px' }} />
            <p>Loading history...</p>
          </div>
        )}

        {error && (
          <div style={{
            padding: '20px',
            background: 'rgba(255, 80, 80, 0.08)',
            border: '1px solid rgba(255, 80, 80, 0.3)',
            borderRadius: '12px',
            color: '#ff8080',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🗂️</div>
            <h2 className="empty-title">No generations yet</h2>
            <p className="empty-desc">
              Your generated SEO content will appear here after you run your first generation.
            </p>
            <button className="btn btn-primary" onClick={onNavigateToGenerate}>
              ✨ Generate First Content
            </button>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <span className="stat-pill stat-pill-violet" style={{ display: 'inline-flex' }}>
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} generated
              </span>
            </div>
            <div className="history-grid">
              {projects.map(project => (
                <HistoryCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
