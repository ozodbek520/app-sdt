import React from 'react';
import Markdown from '../markdown/Markdown';
import styled from 'styled-components';

const StyledAiMessage = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const StyledAiMessageContent = styled.div`
  margin-top: 8px;
  background-color: white;
  color: #1f2023;
  max-width: 70%;
  padding: 8px;
  border-radius: 10px 10px 10px 0;

  @media (max-width: 991px) {
    margin-top: 2rem;
  }

  p:last-child {
    margin-bottom: unset;
  }
`;

const AiMessage = ({ message }) => {
  return (
    <StyledAiMessage>
      <StyledAiMessageContent>
        <Markdown className="markdown" value={message} />
      </StyledAiMessageContent>
    </StyledAiMessage>
  );
};

export default AiMessage;
