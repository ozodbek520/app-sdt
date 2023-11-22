import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGameDetailsById } from '../../store/reducers/applicationSlice';
import CenterBox from '../../UI/CenterBox';
import GameDetailsHeader from '../../components/game-details/GameDetailsHeader';
import NoData from '../../UI/NoData';
import GameDetailsBody from '../../components/game-details/GameDetailsBody';

const StyledDiv = styled.div`
  margin: 5rem 0 2rem 0;
`;

const GameDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { gameDetails, loading, error } = useSelector((state) => state.application);

  useEffect(() => {
    dispatch(fetchGameDetailsById(Number(id)));
  }, [id, dispatch]);

  console.log(gameDetails);

  const renderContent = () => {
    if (loading) return null;

    if (error !== '' && gameDetails === null) {
      return <NoData />;
    }

    return (
      <>
        <GameDetailsHeader title={gameDetails?.title} videoUrl={gameDetails?.assets} />
        <GameDetailsBody gameDetails={gameDetails} />
      </>
    );
  };

  return (
    <CenterBox>
      <StyledDiv>{renderContent()}</StyledDiv>
    </CenterBox>
  );
};

export default GameDetails;
