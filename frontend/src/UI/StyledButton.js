import React, { useCallback } from 'react';

import styled from 'styled-components';

const Button = styled.button`
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  width: 100%;
  font-size: 18px;
  line-height: 18px;
  padding: 12px 16px;
  outline: none;
  border: none;
  font-weight: 700;
  border-radius: 2px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function StyledButton({ type, color, onClick, children, disabled = false, isFilled }) {
  const handleClick = useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);

  return (
    <Button
      type={type}
      color={color}
      disabled={disabled}
      onClick={handleClick}
      className={isFilled}
    >
      {children}
    </Button>
  );
}

export default StyledButton;
