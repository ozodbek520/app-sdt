import React from 'react';
import styled from 'styled-components';

const StyledBox = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledContainer = styled.div`
  position: relative;
  width: 50%;

  .logo-box {
    div {
      img {
        margin-left: 56px;
        width: 147px;
        height: 58px;

        &:nth-child(1) {
          margin-bottom: 4px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 1rem 0 1rem 0;
  }
`;

function CenterBox(props) {
  return (
    <StyledBox>
      <StyledContainer>{props.children}</StyledContainer>
    </StyledBox>
  );
}

export default CenterBox;
