import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import NoData from '../../UI/NoData';
import PlayerCard from './PlayerCard';

const StyledDiv = styled.div``;

const PlayersList = () => {
  const { playersList, loading } = useSelector((state) => state.application);

  return (
    <StyledDiv>
      {!loading && playersList.length === 0 ? (
        <NoData />
      ) : (
        playersList.map((player, idx) => (
          <PlayerCard key={player.gameId} player={player} idx={idx} />
        ))
      )}
    </StyledDiv>
  );
};

export default PlayersList;
