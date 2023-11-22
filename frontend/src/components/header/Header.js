import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 75%;
  border-radius: 8px;
  margin: 7rem auto 2rem auto;
  padding: 12px;
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  font-size: 24px;
`;

function Header({ title, icon }) {
  return (
    <StyledDiv>
      {icon} The Top {title} of All Time
    </StyledDiv>
  );
}

export default Header;
