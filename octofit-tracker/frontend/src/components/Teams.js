import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const teamsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

function normalizeApiListPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
}

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTeams() {
      try {
        setLoading(true);
        console.log('[Teams] endpoint:', teamsApiUrl);
        const response = await fetch(teamsApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const normalizedData = normalizeApiListPayload(data);
        console.log('[Teams] fetched data:', normalizedData);
        if (isMounted) {
          setTeams(normalizedData);
        }
      } catch (err) {
        if (isMounted) {
          setError(`팀 데이터를 불러오지 못했습니다: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTeams();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTeams = teams.filter((team) => {
    if (!search.trim()) {
      return true;
    }
    const q = search.toLowerCase();
    return `${team.name} ${team.city}`.toLowerCase().includes(q);
  });

  return (
    <section className="component-card card">
      <div className="card-body">
      <h2 className="h4 mb-1">Teams</h2>
      <p className="mb-3">
        <a className="link-primary endpoint-link" href={teamsApiUrl} target="_blank" rel="noreferrer">
          {teamsApiUrl}
        </a>
      </p>

      <form className="row g-2 align-items-end mb-3">
        <div className="col-sm-8 col-md-6">
          <label htmlFor="team-search" className="form-label">Search</label>
          <input
            id="team-search"
            type="text"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="team name, city"
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

      {loading && <p>Loading teams...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle component-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => (
                <tr key={team.id}>
                  <td>{team.name}</td>
                  <td>{team.city}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelectedTeam(team)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTeam && (
        <>
          <div className="custom-modal-backdrop" onClick={() => setSelectedTeam(null)} />
          <div className="modal show d-block custom-modal-layer" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Team Detail</h3>
                  <button type="button" className="btn-close" onClick={() => setSelectedTeam(null)} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedTeam, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedTeam(null)}>
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

export default Teams;
