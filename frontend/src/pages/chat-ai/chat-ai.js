import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import CenterBox from '../../UI/CenterBox';
import styled from 'styled-components';
import ChatBG from '../../assets/images/chat-background.png';
import { useDispatch, useSelector } from 'react-redux';
import { addUserMessage, askAIandFetchResponses } from '../../store/reducers/chatSlice';
import UserMessage from '../../components/chat-ai/UserMessage';
import AiMessage from '../../components/chat-ai/AiMessage';
import ChatMessageInput from '../../components/chat-ai/ChatMessageInput';

const StyledDiv = styled.div`
  width: 80%;
  margin: 8rem auto 0 auto;
  border-radius: 10px;

  @media (max-width: 991px) {
    width: 100%;
    margin: 3rem auto 0 auto;
  }
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

const StyledChatMessagesBody = styled.div`
  height: 90%;
  overflow: auto;
  padding: 8px;
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
  const Message = memo(({ message, isUserMessage }) => {
    if (isUserMessage) {
      return <UserMessage message={message} />;
    }
    return <AiMessage message={message} />;
  });

  const renderMessages = () => {
    if (!messagesList || messagesList.length === 0) return null;
    return messagesList.map((message, index) => (
      <Message
        key={index}
        message={message.userMessage || message.aiMessage}
        isUserMessage={!!message.userMessage}
      />
    ));
  };

  return (
    <CenterBox>
      <StyledDiv>
        <StyledChat>
          <ChatMessageInput
            textareaRef={textareaRef}
            handleSubmit={handleSubmit}
            message={message}
            handleMessageChange={handleMessageChange}
            handleKeyPress={handleKeyPress}
            placeholder="Type your message here..."
          />
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
