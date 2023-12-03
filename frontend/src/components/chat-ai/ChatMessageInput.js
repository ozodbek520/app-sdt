import React from 'react';
import styled from 'styled-components';

const StyledChatMessageInput = styled.div`
  background-color: white;
  border-radius: 0 0 10px 10px;
  height: 10%;
  color: #1f2023;
  padding: 8px;
  display: flex;
  align-items: center;

  textarea {
    width: 80%;
    resize: none;
    outline: none;
    border: none;
    padding-right: 8px;
  }

  button {
    width: 20%;
    background-color: #182533;
    color: #fff;
    outline: none;
    box-shadow: none;
    border: none;
    border-radius: 5px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const ChatMessageInput = ({
  textareaRef,
  message,
  handleMessageChange,
  handleKeyPress,
  placeholder,
  handleSubmit,
}) => {
  return (
    <StyledChatMessageInput>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleMessageChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
      <button onClick={handleSubmit}> Send</button>
    </StyledChatMessageInput>
  );
};

export default ChatMessageInput;
