import React from 'react';
import styled from 'styled-components';
import VideoPlayer from '../video-player/VideoPlayer';

const StyledDiv = styled.div`
  padding: 2rem 0 1rem 0;

  .title {
    margin-bottom: 1rem;
    text-align: center;
    color: #81e6d9;
    font-size: 24px;
  }
`;
const GameDetailsHeader = ({ title, videoUrl }) => {
  return (
    <StyledDiv>
      <h3 className="title">{title}</h3>
      <VideoPlayer videoUrl={videoUrl} />
    </StyledDiv>
  );
};

export default GameDetailsHeader;
