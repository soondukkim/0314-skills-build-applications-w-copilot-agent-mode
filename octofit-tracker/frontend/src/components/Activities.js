import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const activitiesApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function normalizeApiListPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
}

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchActivities() {
      try {
        setLoading(true);
        console.log('[Activities] endpoint:', activitiesApiUrl);
        const response = await fetch(activitiesApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const normalizedData = normalizeApiListPayload(data);
        console.log('[Activities] fetched data:', normalizedData);
        if (isMounted) {
          setActivities(normalizedData);
        }
      } catch (err) {
        if (isMounted) {
          setError(`활동 데이터를 불러오지 못했습니다: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchActivities();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredActivities = activities.filter((activity) => {
    if (!search.trim()) {
      return true;
    }
    const q = search.toLowerCase();
    return `${activity.activity_type} ${activity.user_id} ${activity.calories_burned}`
      .toLowerCase()
      .includes(q);
  });

  return (
    <section className="component-card card">
      <div className="card-body">
      <h2 className="h4 mb-1">Activities</h2>
      <p className="mb-3">
        <a className="link-primary endpoint-link" href={activitiesApiUrl} target="_blank" rel="noreferrer">
          {activitiesApiUrl}
        </a>
      </p>

      <form className="row g-2 align-items-end mb-3">
        <div className="col-sm-8 col-md-6">
          <label htmlFor="activities-search" className="form-label">Search</label>
          <input
            id="activities-search"
            type="text"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="type, user id, calories"
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

      {loading && <p>Loading activities...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle component-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Type</th>
                <th>Duration (min)</th>
                <th>Calories</th>
                <th>Recorded At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.user_id}</td>
                  <td>{activity.activity_type}</td>
                  <td>{activity.duration_minutes}</td>
                  <td>{activity.calories_burned}</td>
                  <td>{activity.recorded_at}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedActivity(activity)}
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

      {selectedActivity && (
        <>
          <div className="custom-modal-backdrop" onClick={() => setSelectedActivity(null)} />
          <div className="modal show d-block custom-modal-layer" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Activity Detail</h3>
                  <button type="button" className="btn-close" onClick={() => setSelectedActivity(null)} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedActivity, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedActivity(null)}>
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

export default Activities;
