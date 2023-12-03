import React from 'react';
import Markdown from '../markdown/Markdown';
import styled from 'styled-components';

const StyledUserMessage = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledUserMessageContent = styled.div`
  background-color: #81e6d9;
  color: #1f2023;
  max-width: 70%;
  padding: 8px;
  border-radius: 10px 10px 0 10px;
  margin-top: 8px;

  @media (max-width: 991px) {
    margin-top: 2rem;
  }

  p:last-child {
    margin-bottom: unset;
  }
`;

const UserMessage = ({ message }) => {
  return (
    <StyledUserMessage>
      <StyledUserMessageContent>
        <Markdown className="markdown" value={message} />
      </StyledUserMessageContent>
    </StyledUserMessage>
  );
};

export default UserMessage;
