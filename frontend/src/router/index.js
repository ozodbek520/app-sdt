import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/home/home';
import Players from '../pages/players/players';
import GameDetails from '../pages/game-details/game-details';

export const CustomRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game-details/:id" element={<GameDetails />} />
      <Route path="/players" element={<Players />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
