import React from 'react';
import CenterBox from '../../UI/CenterBox';
import Header from '../../components/header/Header';
import GamesList from '../../components/games/GamesList';
import { fetchVideoGamesList } from '../../store/reducers/applicationSlice';
import useFetchByAction from '../../hooks/useFetchByAction';

function Home() {
  useFetchByAction(fetchVideoGamesList, true);

  return (
    <CenterBox>
      <Header title="Video Games" icon="👾" />
      <GamesList />
    </CenterBox>
  );
}

export default Home;
