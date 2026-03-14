import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const usersApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

function normalizeApiListPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
}

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        setLoading(true);
        console.log('[Users] endpoint:', usersApiUrl);
        const response = await fetch(usersApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const normalizedData = normalizeApiListPayload(data);
        console.log('[Users] fetched data:', normalizedData);
        if (isMounted) {
          setUsers(normalizedData);
        }
      } catch (err) {
        if (isMounted) {
          setError(`사용자 데이터를 불러오지 못했습니다: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    if (!search.trim()) {
      return true;
    }
    const q = search.toLowerCase();
    return `${user.username} ${user.email} ${user.team_id ?? ''}`.toLowerCase().includes(q);
  });

  return (
    <section className="component-card card">
      <div className="card-body">
      <h2 className="h4 mb-1">Users</h2>
      <p className="mb-3">
        <a className="link-primary endpoint-link" href={usersApiUrl} target="_blank" rel="noreferrer">
          {usersApiUrl}
        </a>
      </p>

      <form className="row g-2 align-items-end mb-3">
        <div className="col-sm-8 col-md-6">
          <label htmlFor="user-search" className="form-label">Search</label>
          <input
            id="user-search"
            type="text"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="username, email, team id"
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

      {loading && <p>Loading users...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle component-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Age</th>
                <th>Team ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>{user.team_id ?? '-'}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelectedUser(user)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <>
          <div className="custom-modal-backdrop" onClick={() => setSelectedUser(null)} />
          <div className="modal show d-block custom-modal-layer" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">User Detail</h3>
                  <button type="button" className="btn-close" onClick={() => setSelectedUser(null)} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedUser, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
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

export default Users;
