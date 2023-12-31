import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ImageComponent from '../image-component/ImageComponent';
import { FormattedNumber } from 'react-intl';

const StyledDiv = styled.div`
  margin-top: 2rem;

  .title {
    color: #ff62c2;
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
    margin: 1rem 0;
    list-style-type: none;
    padding: 0;

    li {
      display: inline-block;
      margin-right: 1rem;
      font-size: 16px;
      margin-bottom: 12px;

      &.prize {
        span {
          background-color: #fbd28d;
          color: #202023;
        }
      }
    }
  }

  .line {
    background-color: #525252;
    height: 4px;
    width: 60%;
    border-radius: 2px;
  }
`;

const PlayerCard = ({ idx = '', player }) => {
  return (
    <StyledDiv>
      <a href={player?.socialLink} target="_blank" rel="noreferrer" className={'title'}>
        {idx !== '' ? `#${idx + 1}` : ''} {player?.playerName} 🔗
      </a>
      <ImageComponent imageUrl={player?.playerImageURL} title={player?.playerName} />
      <ul className="footer-line">
        <li className="prize">
          <b>Earnings:</b>{' '}
          <span>
            <FormattedNumber value={player?.prize} style={'currency'} currency="USD" />
          </span>
        </li>
        <li>
          <Link to={`/game-details/${player?.playerGameID}`} className={'styled-btn'}>
            {player?.playerGameName}
          </Link>
        </li>
      </ul>
      <div className="line" />
    </StyledDiv>
  );
};

export default PlayerCard;
