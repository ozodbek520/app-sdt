import React from 'react';
import styled from 'styled-components';
import Navbar from '../navbar/Navbar';
import { Container } from 'react-bootstrap';

const StyledDiv = styled.div`
  padding-bottom: 5rem;
`;

function Layout({ children }) {
  return (
    <StyledDiv>
      <Navbar />
      <Container>{children}</Container>
    </StyledDiv>
  );
}

export default Layout;
