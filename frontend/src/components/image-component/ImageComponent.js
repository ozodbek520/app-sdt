import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  max-width: 100%;
  height: auto;
  background-size: cover;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
    opacity: ${({ loading }) => (loading ? 0 : 1)};
    transition: opacity 0.3s ease;
  }
`;
const ImageComponent = ({ imageUrl, title }) => {

  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return null;
  }

  return (
    <StyledDiv >
      <img src={imageUrl} alt={`game-${title}`} />
    </StyledDiv>
  );
};

export default ImageComponent;
