import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBestPlayerDetailsByGameId } from '../../store/reducers/applicationSlice';
import styled from 'styled-components';
import CenterBox from '../../UI/CenterBox';
import NoData from '../../UI/NoData';
import PlayerCard from '../../components/players/PlayerCard';

const StyledDiv = styled.div`
  margin: 5rem 0 2rem 0;
`;

const PlayerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { bestPlayerDetails, loading, error } = useSelector((state) => state.application);

  useEffect(() => {
    dispatch(fetchBestPlayerDetailsByGameId(Number(id)));
  }, [id, dispatch]);

  const renderContent = () => {
    if (loading) return null;

    if (error !== '' && bestPlayerDetails === null) {
      return <NoData />;
    }

    return <PlayerCard player={bestPlayerDetails} />;
  };

  return (
    <CenterBox>
      <StyledDiv>{renderContent()}</StyledDiv>
    </CenterBox>
  );
};

export default PlayerDetails;
