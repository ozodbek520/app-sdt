import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CenterBox from '../../UI/CenterBox';
import styled from 'styled-components';
import ChatBG from '../../assets/images/chat-background.png';
import { useDispatch, useSelector } from 'react-redux';
import { addUserMessage, askAIandFetchResponses } from '../../store/reducers/chatSlice';
import Markdown from '../../components/markdown/Markdown';

const StyledDiv = styled.div`
  width: 80%;
  margin: 8rem auto 0 auto;
  padding: 12px;
  background-color: #000;
  border-radius: 10px;
`;

const StyledChat = styled.div`
  height: 70vh;
  background-image: url(${ChatBG});
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  border-radius: 10px;
  display: flex;
  flex-direction: column-reverse;
`;

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
  }
`;

const StyledChatMessagesBody = styled.div`
  height: 90%;
  overflow: auto;
  padding: 8px;
`;

const StyledAiMessage = styled.div`
  display: flex;
  justify-content: flex-start;
`;
const StyledUserMessage = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledAiMessageContent = styled.div`
  margin-top: 8px;
  background-color: white;
  color: #1f2023;
  max-width: 70%;
  padding: 8px;
  border-radius: 10px 10px 10px 0;

  p:last-child {
    margin-bottom: unset;
  }
`;

const StyledUserMessageContent = styled.div`
  background-color: #1f2023;
  color: #fff;
  max-width: 70%;
  padding: 8px;
  border-radius: 10px 10px 0 10px;
  margin-top: 8px;

  p:last-child {
    margin-bottom: unset;
  }
`;

const ChatAi = () => {
  const { messagesList } = useSelector((state) => state.chat);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messagesList]);

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message !== '') {
      dispatch(askAIandFetchResponses(message));
      dispatch(addUserMessage(message));
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderMessages = () => {
    if (messagesList?.length === 0) return null;
    return messagesList.map((message, index) => {
      if (message?.userMessage) {
        return (
          <StyledUserMessage key={index}>
            <StyledUserMessageContent>
              <Markdown className="markdown" value={message?.userMessage} />
            </StyledUserMessageContent>
          </StyledUserMessage>
        );
      }
      if (message?.aiMessage) {
        return (
          <StyledAiMessage key={index}>
            <StyledAiMessageContent>
              <Markdown className="markdown" value={message?.aiMessage} />
            </StyledAiMessageContent>
          </StyledAiMessage>
        );
      }
    });
  };

  return (
    <CenterBox>
      <StyledDiv>
        <StyledChat>
          <StyledChatMessageInput>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
            />
            <button onClick={handleSubmit}> Send</button>
          </StyledChatMessageInput>
          <StyledChatMessagesBody>
            {renderMessages()}
            <div ref={messagesEndRef} />
          </StyledChatMessagesBody>
        </StyledChat>
      </StyledDiv>
    </CenterBox>
  );
};

export default ChatAi;
