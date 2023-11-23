import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GameCard from './GameCard';
import styled from 'styled-components';
import NoData from '../../UI/NoData';
import { loadMoreGames } from '../../store/reducers/applicationSlice';

const StyledDiv = styled.div``;

const GamesList = () => {
  const { gamesList, loading, error } = useSelector((state) => state.application);
  const dispatch = useDispatch();

  return (
    <StyledDiv>
      {!loading && error ? (
        <NoData />
      ) : (
        <>
          {gamesList.map((game, id) => (
            <GameCard key={id} game={game} />
          ))}
          <br />
          <button onClick={() => dispatch(loadMoreGames())} className="styled-btn">
            Load more
          </button>
        </>
      )}
    </StyledDiv>
  );
};

export default GamesList;
