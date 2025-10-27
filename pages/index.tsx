import { useEffect, useState } from 'react';
import Head from 'next/head';

interface SiteStatus {
  url: string;
  status: 'up' | 'down';
  statusCode?: number;
}

interface StatusResponse {
  server1: SiteStatus[];
  server2: SiteStatus[];
  timestamp: string;
}

export default function Home() {
  const [statuses, setStatuses] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [checkTime, setCheckTime] = useState<Date | null>(null);

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/check-status');
      const data = await response.json();
      setStatuses(data);
      const now = new Date();
      setCheckTime(now);
      setLastChecked(now.toLocaleTimeString());
    } catch (error) {
      console.error('Failed to check status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getUpCount = (sites: SiteStatus[]) => {
    return sites.filter(s => s.status === 'up').length;
  };

  const sortAndGroupSites = (sites: SiteStatus[]) => {
    const upSites = sites.filter(s => s.status === 'up');
    const downSites = sites.filter(s => s.status === 'down');
    return { upSites, downSites };
  };

  const SiteCard = ({ site }: { site: SiteStatus }) => {
    const isUp = site.status === 'up';
    const domain = site.url.replace('https://', '').replace('http://', '');
    
    return (
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`site-row ${isUp ? 'up' : 'down'}`}
      >
        <div className="site-main">
          <span className="status-emoji">{isUp ? '🟢' : '🔴'}</span>
          <span className="domain-name">{domain}</span>
        </div>
        <div className="site-meta">
          <span className={`status-pill ${isUp ? 'pill-up' : 'pill-down'}`}>
            {isUp ? 'UP' : 'DOWN'}
          </span>
          {site.statusCode && (
            <span className="status-code">{site.statusCode}</span>
          )}
        </div>
      </a>
    );
  };

  return (
    <>
      <Head>
        <title>Site Monitor - Status Dashboard</title>
        <meta name="description" content="Real-time monitoring of server sites" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <header className="header">
          <div className="header-left">
            <span className="header-icon">🖥️</span>
            <h1 className="header-title">Site Monitor</h1>
          </div>
          <div className="header-right">
            <button
              onClick={checkStatus}
              disabled={loading}
              className={`refresh-button ${loading ? 'spinning' : ''}`}
            >
              <svg className="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Checking...' : 'Refresh'}
            </button>
          </div>
        </header>

        <div className="header-footer">
          <span className="last-checked">
            {checkTime ? `Last checked: ${getTimeAgo(checkTime)}` : 'Loading...'}
          </span>
        </div>

        {loading && !statuses && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Checking site statuses...</p>
          </div>
        )}

        {statuses && (
          <div className="servers-grid">
            <div className="server-card">
              <div className="server-header">
                <span className="server-icon">💻</span>
                <h2 className="server-title">Server 1</h2>
                <span className="server-stats">
                  ✅ {getUpCount(statuses.server1)}/{statuses.server1.length} up
                </span>
              </div>
              <div className="sites-container">
                {sortAndGroupSites(statuses.server1).upSites.map((site) => (
                  <SiteCard key={site.url} site={site} />
                ))}
                {sortAndGroupSites(statuses.server1).downSites.length > 0 && (
                  <>
                    <div className="status-divider"></div>
                    {sortAndGroupSites(statuses.server1).downSites.map((site) => (
                      <SiteCard key={site.url} site={site} />
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="server-card">
              <div className="server-header">
                <span className="server-icon">💻</span>
                <h2 className="server-title">Server 2</h2>
                <span className="server-stats">
                  ✅ {getUpCount(statuses.server2)}/{statuses.server2.length} up
                </span>
              </div>
              <div className="sites-container">
                {sortAndGroupSites(statuses.server2).upSites.map((site) => (
                  <SiteCard key={site.url} site={site} />
                ))}
                {sortAndGroupSites(statuses.server2).downSites.length > 0 && (
                  <>
                    <div className="status-divider"></div>
                    {sortAndGroupSites(statuses.server2).downSites.map((site) => (
                      <SiteCard key={site.url} site={site} />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #f0f2f5;
          padding: 2rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        .header {
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          padding: 20px 30px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          box-shadow: 0 4px 20px rgba(37, 117, 252, 0.3);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          font-size: 2rem;
        }

        .header-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .refresh-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .refresh-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .refresh-button.spinning .refresh-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .refresh-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .header-footer {
          padding: 0.75rem 0;
          margin-bottom: 1.5rem;
        }

        .last-checked {
          color: #718096;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          border: 4px solid #e2e8f0;
          border-top-color: #2575fc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .servers-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .server-card {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .server-card:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .server-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .server-icon {
          font-size: 1.5rem;
        }

        .server-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
          flex: 1;
        }

        .server-stats {
          font-size: 0.875rem;
          font-weight: 600;
          color: #48bb78;
          background: #f0f9f5;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .sites-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .status-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          margin: 1rem 0;
          position: relative;
        }

        .status-divider::before,
        .status-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e2e8f0;
        }

        .status-divider::before {
          left: 0;
        }

        .status-divider::after {
          right: 0;
        }

        .site-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: #f7fafc;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 4px solid;
          position: relative;
        }

        .site-row.up {
          border-left-color: #48bb78;
        }

        .site-row.down {
          border-left-color: #f56565;
        }

        .site-row:hover {
          background: #edf2f7;
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .site-main {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .status-emoji {
          font-size: 1.25rem;
        }

        .domain-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1a202c;
        }

        .site-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-pill {
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pill-up {
          background: #d4edda;
          color: #155724;
        }

        .pill-down {
          background: #f8d7da;
          color: #721c24;
        }

        .status-code {
          font-size: 0.75rem;
          color: #a0aec0;
          background: white;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-weight: 600;
        }

        @media (max-width: 1200px) {
          .servers-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .header {
            padding: 1.25rem 1.5rem;
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .header-title {
            font-size: 1.5rem;
          }

          .server-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .server-stats {
            align-self: flex-start;
          }

          .site-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .site-meta {
            align-self: flex-start;
          }
        }
      `}</style>
    </>
  );
}