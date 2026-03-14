import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

function App() {
  const navItems = [
    { to: '/users', label: 'Users' },
    { to: '/teams', label: 'Teams' },
    { to: '/activities', label: 'Activities' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/workouts', label: 'Workouts' },
  ];

  return (
    <div className="container py-4 app-shell">
      <header className="app-header mb-4 shadow-sm">
        <div className="brand-wrap mb-3">
          <img src={`${process.env.PUBLIC_URL}/octofitapp-small.png`} alt="OctoFit logo" className="brand-logo" />
          <div>
            <h1 className="h3 mb-1 fw-semibold">OctoFit Tracker</h1>
            <p className="text-muted mb-2">Backend API: {apiBaseUrl}</p>
            <a className="link-primary endpoint-link" href={apiBaseUrl} target="_blank" rel="noreferrer">
              Open API Root
            </a>
          </div>
        </div>
        <nav className="nav nav-pills flex-wrap gap-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="card main-panel shadow-sm">
        <div className="card-body">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
