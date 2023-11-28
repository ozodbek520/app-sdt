import React from 'react';
import styled from 'styled-components';
import useDateFormatter from '../../hooks/useDateFormatter';
import { Link, useNavigate } from 'react-router-dom';

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

  .player-btn {
    padding: 8px 12px;
    position: relative;
    white-space: nowrap;
    vertical-align: middle;
    outline-offset: 2px;
    line-height: 1.2;
    border-radius: 8px;
    font-weight: 600;
    transition-property: all;
    transition-duration: 0.2s;
    height: 40px;
    min-width: 40px;
    font-size: 16px;
    background: #1fc600;
    color: #424242;
    text-decoration: none;
    box-shadow: none;
    outline: none;
    border: none;
  }
`;
const GameDetailsBody = ({ gameDetails }) => {
  const { formatDate } = useDateFormatter();
  const navigate = useNavigate();

  const formattedDate = formatDate(gameDetails?.releaseDate);

  const handleShowBestPlayer = (id) => navigate(`/player-details/${id}`);

  return (
    <StyledDiv>
      <ul className="footer-line">
        <li>
          <b>Rating</b> ⭐️: {gameDetails?.ranking}
        </li>
        <li>
          <b>Release Date</b> 🗓️: {formattedDate}
        </li>
        <li>
          <b>Times Listed</b> 📈: {gameDetails?.timesListed}
        </li>
      </ul>
      <p className={'description'}>{gameDetails?.summary}</p>
      {gameDetails?.playerName !== 'DJxoSAUlrz' && (
        <button className="player-btn" onClick={() => handleShowBestPlayer(gameDetails?.id)}>
          👑 Show best player
        </button>
      )}
      <br />
      <br />
      <h5>Developer companies:</h5>
      <br />
      <ul className="footer-line">
        {gameDetails?.developers.map((developer) => (
          <li key={developer.companyId}>
            <Link to={`/companies/${developer.companyId}`} className={'styled-btn styled-game-btn'}>
              {developer.name}
            </Link>
          </li>
        ))}
      </ul>
    </StyledDiv>
  );
};

export default GameDetailsBody;
