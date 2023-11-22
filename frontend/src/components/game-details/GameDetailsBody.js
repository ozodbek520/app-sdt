import React from 'react';
import styled from 'styled-components';
import useDateFormatter from '../../hooks/useDateFormatter';

const StyledDiv = styled.div`
  .footer-line {
    list-style-type: none;
    padding: 0;

    li {
      display: inline-block;
      margin-right: 1rem;
      font-size: 16px;
    }
  }
`;
const GameDetailsBody = ({ gameDetails }) => {
  const { formatDate } = useDateFormatter();

  const formattedDate = formatDate(gameDetails?.releaseDate);

  return (
    <StyledDiv>
      <ul className="footer-line">
        <li>
          <b>Rating:</b> ⭐️ {gameDetails?.averageUserRating}
        </li>
        <li>
          <b>Release Date:</b> 🗓️ {formattedDate}
        </li>
      </ul>
      <p className={'description'}>{gameDetails?.description}</p>
    </StyledDiv>
  );
};

export default GameDetailsBody;
