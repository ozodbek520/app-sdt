import React from 'react';
import styled from 'styled-components';
import Tell from './src/tell.svg';
import Profile from './src/profile.svg';
import Settings from './src/settings.svg';
import Exit from './src/exit.svg';
import BottomArrow from './src/bottom-arrow.svg';
import File from './src/file.svg'

const StyledSpan = styled.span`
  width: 24px;
  height: 24px;
  display: inline-block;
  mask-repeat: no-repeat;
  mask-size: 100%;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100%;
  -webkit-mask-position: center;
  background-color: ${(props) => props.$bgcolor || '#000'};
  vertical-align: middle;
  mask-image: url(${(props) => props.$src});
  -webkit-mask-image: url(${(props) => props.$src});
`;

const ImgObj = {
  tell: Tell,
  exit: Exit,
  profile: Profile,
  settings: Settings,
  bArrow: BottomArrow,
  file:File,
};

const IconColor = {
  green: '#1AD598',
  black: '#000',
  blue: '#0090FF',
  purple: '#3A36DB',
  lightBlue: '#0077B6',
  pink: '#DB5AEE',
  silver:'rgba(0, 0, 0, 0.50)',
};

function Icon({ type, onClick, style, color }) {
  return (
    <StyledSpan style={style} $src={ImgObj[type]} $bgcolor={IconColor[color]} onClick={onClick} />
  );
}

export default Icon;
