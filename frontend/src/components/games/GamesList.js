import React from 'react';
import { useSelector } from 'react-redux';
import GameCard from './GameCard';
import styled from 'styled-components';
import NoData from '../../UI/NoData';

const StyledDiv = styled.div``;

const GamesList = () => {
  const { gamesList, loading } = useSelector((state) => state.application);

  return (
    <StyledDiv>
      {!loading && gamesList.length === 0 ? (
        <NoData />
      ) : (
        gamesList.map((game, idx) => <GameCard key={game.id} game={game} idx={idx} />)
      )}
    </StyledDiv>
  );
};

export default GamesList;
