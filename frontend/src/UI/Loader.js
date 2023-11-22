import React from 'react';

import styled from 'styled-components';

const Box = styled.div`
  height: 5px;
  width: 35px;
  display: flex;
  position: relative;
  margin-right: 10px;
`;

const Span = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${(props) => (props.color === 'white' ? '#fff' : '#005db8')};
  animation: move 500ms linear 0ms infinite;
  margin-right: 10px;

  &:first-child {
    position: absolute;
    top: 0;
    left: 0;
    animation: grow 500ms linear 0ms infinite;
  }

  &:last-child {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 0;
    animation: grow 500ms linear 0s infinite reverse;
  }

  @keyframes grow {
    from {
      transform: scale(0, 0);
      opacity: 0;
    }
    to {
      transform: scale(1, 1);
      opacity: 1;
    }
  }

  @keyframes move {
    from {
      transform: translateX(0px);
    }
    to {
      transform: translateX(15px);
    }
  }
`;

function Loader({ color }) {
  return (
    <Box>
      <Span color={color} />
      <Span color={color} />
      <Span color={color} />
      <Span color={color} />
    </Box>
  );
}

export default Loader;
