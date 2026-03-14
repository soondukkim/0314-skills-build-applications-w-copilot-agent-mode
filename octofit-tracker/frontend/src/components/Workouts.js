import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const workoutsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/';

function normalizeApiListPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
}

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchWorkouts() {
      try {
        setLoading(true);
        console.log('[Workouts] endpoint:', workoutsApiUrl);
        const response = await fetch(workoutsApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const normalizedData = normalizeApiListPayload(data);
        console.log('[Workouts] fetched data:', normalizedData);
        if (isMounted) {
          setWorkouts(normalizedData);
        }
      } catch (err) {
        if (isMounted) {
          setError(`운동 추천 데이터를 불러오지 못했습니다: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWorkouts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredWorkouts = workouts.filter((workout) => {
    if (!search.trim()) {
      return true;
    }
    const q = search.toLowerCase();
    return `${workout.title} ${workout.difficulty} ${workout.user_id}`.toLowerCase().includes(q);
  });

  return (
    <section className="component-card card">
      <div className="card-body">
      <h2 className="h4 mb-1">Workouts</h2>
      <p className="mb-3">
        <a className="link-primary endpoint-link" href={workoutsApiUrl} target="_blank" rel="noreferrer">
          {workoutsApiUrl}
        </a>
      </p>

      <form className="row g-2 align-items-end mb-3">
        <div className="col-sm-8 col-md-6">
          <label htmlFor="workouts-search" className="form-label">Search</label>
          <input
            id="workouts-search"
            type="text"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="title, difficulty, user id"
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

      {loading && <p>Loading workouts...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle component-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Recommended Minutes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.user_id}</td>
                  <td>{workout.title}</td>
                  <td>{workout.difficulty}</td>
                  <td>{workout.recommended_minutes}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedWorkout(workout)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedWorkout && (
        <>
          <div className="custom-modal-backdrop" onClick={() => setSelectedWorkout(null)} />
          <div className="modal show d-block custom-modal-layer" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Workout Detail</h3>
                  <button type="button" className="btn-close" onClick={() => setSelectedWorkout(null)} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedWorkout, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedWorkout(null)}>
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

export default Workouts;
