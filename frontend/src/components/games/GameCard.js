import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ImageComponent from '../image-component/ImageComponent';
import useDateFormatter from '../../hooks/useDateFormatter';

const StyledDiv = styled.div`
  margin-top: 2rem;

  .title {
    color: #81e6d9;
    font-size: 24px;
    text-decoration: none;
    margin-bottom: 1rem;
    display: inline-block;
  }

  .description {
    margin-top: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .footer-line {
    margin: 2rem 0 1.5rem 0;
    list-style-type: none;
    padding: 0;

    li {
      display: inline-block;
      margin-right: 1rem;
      font-size: 16px;
    }
  }

  .line {
    background-color: #525252;
    height: 4px;
    width: 60%;
    border-radius: 2px;
  }
`;
const GameCard = ({ idx, game }) => {
  const { formatDate } = useDateFormatter();

  const formattedDate = formatDate(game.releaseDate);

  return (
    <StyledDiv>
      <Link className={'title'} to={`/game-details/${game.id}`}>
        #{idx + 1} {game.title}
      </Link>
      <ImageComponent imageUrl={game.hasImage} title={game.title} />
      <p className={'description'}>{game.description}</p>
      <ul className="footer-line">
        <li>
          <b>Rating:</b> ⭐️ {game.averageUserRating}
        </li>
        <li>
          <b>Release Date:</b> 🗓️ {formattedDate}
        </li>
        <li>
          <Link to={`/game-details/${game.id}`} className={'styled-btn'}>
            Learn more
          </Link>
        </li>
      </ul>
      <div className="line" />
    </StyledDiv>
  );
};

export default GameCard;
