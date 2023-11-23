import React, { useEffect, useMemo } from 'react';
import Header from '../../components/header/Header';
import CenterBox from '../../UI/CenterBox';
import PlayersList from '../../components/players/PlayersList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBestPlayersList } from '../../store/reducers/applicationSlice';
import { useLocation } from 'react-router-dom';
import { paramsMap } from '../../const';

const Players = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { search } = useSelector((state) => state.application);

  const param = useMemo(() => paramsMap[pathname], [pathname]);
  const paramValue = useMemo(() => search[param], [search, param]);

  useEffect(() => {
    dispatch(fetchBestPlayersList({ paramValue }));
  }, [paramValue, dispatch]);

  return (
    <CenterBox>
      <Header title={'Players'} icon={'🕹️'} />
      <PlayersList />
    </CenterBox>
  );
};

export default Players;
