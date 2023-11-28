import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { paramsMap } from '../const';

const UseFetchByAction = (fetchAction, includeCurrentPage = false) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { search, currentGamesPage } = useSelector((state) => state.application);

  useEffect(() => {
    const param = paramsMap[location.pathname];
    const paramValue = search[param];

    if (fetchAction) {
      const actionPayload = { paramValue };
      if (includeCurrentPage) {
        actionPayload.currentGamesPage = currentGamesPage;
      }

      dispatch(fetchAction(actionPayload));
    }
  }, [location, search, currentGamesPage, dispatch, fetchAction, includeCurrentPage]);
};

export default UseFetchByAction;
