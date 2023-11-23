import React, { useEffect } from 'react';
import CenterBox from '../../UI/CenterBox';
import Header from '../../components/header/Header';
import GamesList from '../../components/games/GamesList';
import { fetchVideoGamesList } from '../../store/reducers/applicationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { paramsMap } from '../../const';

function Home() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { search, currentGamesPage } = useSelector((state) => state.application);
  const param = paramsMap[pathname];
  const paramValue = search[param];

  useEffect(() => {
    dispatch(fetchVideoGamesList({ paramValue, currentGamesPage }));
  }, [paramValue, dispatch, currentGamesPage]);

  return (
    <CenterBox>
      <Header title={'Video Games'} icon={'👾'} />
      <GamesList />
    </CenterBox>
  );
}

export default Home;
