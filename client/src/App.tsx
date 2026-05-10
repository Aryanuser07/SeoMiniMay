import { useState } from 'react';
import './index.css';
import { Generate } from './pages/Generate';
import { History } from './pages/History';

type Page = 'generate' | 'history';

function App() {
  const [activePage, setActivePage] = useState<Page>('generate');

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a className="navbar-brand" href="#" onClick={() => setActivePage('generate')}>
            <span className="navbar-brand-cursive"><span>LocalSEO AI</span></span>
          </a>
          <div className="navbar-nav">
            <button
              id="nav-generate"
              className={`nav-link ${activePage === 'generate' ? 'active' : ''}`}
              onClick={() => setActivePage('generate')}
            >
              Generate
            </button>
            <button
              id="nav-history"
              className={`nav-link ${activePage === 'history' ? 'active' : ''}`}
              onClick={() => setActivePage('history')}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {/* Pages */}
      {activePage === 'generate' && <Generate />}
      {activePage === 'history' && (
        <History onNavigateToGenerate={() => setActivePage('generate')} />
      )}
    </>
  );
}

export default App;
