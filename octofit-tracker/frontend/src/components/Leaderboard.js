import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const leaderboardApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

function normalizeApiListPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
}

function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchLeaderboard() {
      try {
        setLoading(true);
        console.log('[Leaderboard] endpoint:', leaderboardApiUrl);
        const response = await fetch(leaderboardApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const normalizedData = normalizeApiListPayload(data);
        console.log('[Leaderboard] fetched data:', normalizedData);
        if (isMounted) {
          setRows(normalizedData);
        }
      } catch (err) {
        if (isMounted) {
          setError(`리더보드 데이터를 불러오지 못했습니다: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLeaderboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRows = rows.filter((row) => {
    if (!search.trim()) {
      return true;
    }
    const q = search.toLowerCase();
    return `${row.rank} ${row.user_id} ${row.points}`.toLowerCase().includes(q);
  });

  return (
    <section className="component-card card">
      <div className="card-body">
      <h2 className="h4 mb-1">Leaderboard</h2>
      <p className="mb-3">
        <a className="link-primary endpoint-link" href={leaderboardApiUrl} target="_blank" rel="noreferrer">
          {leaderboardApiUrl}
        </a>
      </p>

      <form className="row g-2 align-items-end mb-3">
        <div className="col-sm-8 col-md-6">
          <label htmlFor="leaderboard-search" className="form-label">Search</label>
          <input
            id="leaderboard-search"
            type="text"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="rank, user id, points"
          />
        </div>
        <div className="col-sm-4 col-md-6 d-flex gap-2">
          <button type="button" className="btn btn-primary" onClick={() => setSearch(search.trim())}>
            Apply
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setSearch('')}>
            Clear
          </button>
        </div>
      </form>

      {loading && <p>Loading leaderboard...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle component-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User ID</th>
                <th>Points</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.rank}</td>
                  <td>{row.user_id}</td>
                  <td>{row.points}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelectedRow(row)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRow && (
        <>
          <div className="custom-modal-backdrop" onClick={() => setSelectedRow(null)} />
          <div className="modal show d-block custom-modal-layer" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Leaderboard Detail</h3>
                  <button type="button" className="btn-close" onClick={() => setSelectedRow(null)} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedRow, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedRow(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </section>
  );
}

export default Leaderboard;
