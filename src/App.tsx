import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Heroes from './Heroes';
import HeroDetail from './HeroDetail';
import Messages from './Messages';
import APOD from './NasaPhoto';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>React Tour of Heroes</h1>
      
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/heroes">Heroes</Link>
        <Link to="/apod">APOD</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/heroes" element={<Heroes />} />
        <Route path="/detail/:heroId" element={<HeroDetail />} />
        <Route path="/apod" element={<APOD />} />
      </Routes>

      <Messages />
    </div>
  );
}

export default App;