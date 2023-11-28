import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/home/home';
import Players from '../pages/players/players';
import GameDetails from '../pages/game-details/game-details';
import PlayerDetails from '../pages/player-details/player-details';
import Companies from '../pages/companies/companies';
import CompanyDetails from '../components/company-details/CompanyDetails';

export const CustomRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game-details/:id" element={<GameDetails />} />
      <Route path="/player-details/:id" element={<PlayerDetails />} />
      <Route path="/players" element={<Players />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/companies/:id" element={<CompanyDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
