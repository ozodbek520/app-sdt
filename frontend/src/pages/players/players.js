import React from 'react';
import Header from '../../components/header/Header';
import CenterBox from '../../UI/CenterBox';
import PlayersList from '../../components/players/PlayersList';
import { fetchBestPlayersList } from '../../store/reducers/applicationSlice';
import useFetchByAction from '../../hooks/useFetchByAction';

const Players = () => {
  useFetchByAction(fetchBestPlayersList);

  return (
    <CenterBox>
      <Header title={'Players'} icon={'🕹️'} />
      <PlayersList />
    </CenterBox>
  );
};

export default Players;
