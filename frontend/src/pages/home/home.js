import React, { useEffect, useMemo } from 'react';
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

  const param = useMemo(() => paramsMap[pathname], [pathname]);
  const paramValue = useMemo(() => search[param], [search, param]);

  useEffect(() => {
    dispatch(fetchVideoGamesList({ paramValue, currentGamesPage }));
  }, [paramValue, dispatch, currentGamesPage]);

  return (
    <CenterBox>
      <Header title="Video Games" icon="👾" />
      <GamesList />
    </CenterBox>
  );
}

export default Home;
