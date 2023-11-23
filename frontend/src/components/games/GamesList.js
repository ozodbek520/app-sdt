import React from 'react';
import { useSelector } from 'react-redux';
import GameCard from './GameCard';
import styled from 'styled-components';
import NoData from '../../UI/NoData';

const StyledDiv = styled.div`
  .load-more-btn {
    padding: 8px 12px;
    position: relative;
    white-space: nowrap;
    vertical-align: middle;
    outline-offset: 2px;
    line-height: 1.2;
    border-radius: 8px;
    font-weight: 600;
    transition-property: all;
    transition-duration: 0.2s;
    height: 40px;
    min-width: 40px;
    font-size: 16px;
    background: #ffd33f;
    color: #424242;
    text-decoration: none;
    box-shadow: none;
    outline: none;
    border: none;
  }
`;

const GamesList = () => {
  const { gamesList, loading, error } = useSelector((state) => state.application);

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
          {/*<div className="d-flex justify-content-center">
            <button onClick={() => dispatch(loadMoreGames())} className="load-more-btn">
            Load more
          </button>
          </div>*/}
        </>
      )}
    </StyledDiv>
  );
};

export default GamesList;
