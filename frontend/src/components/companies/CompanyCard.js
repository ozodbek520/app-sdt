import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledDiv = styled.div`
  margin-top: 2rem;

  .card-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;

    .logo-box {
      width: 70px;
      margin-right: 16px;
      object-fit: contain;
    }
  }

  .title {
    color: #ffd33f;
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
const CompanyCard = ({ company }) => {
  return (
    <StyledDiv>
      <div className="card-header">
        <img className="logo-box" src={company?.companyLogoURL} alt={company?.name} />
        <Link to={`/companies/${company?.id}`} className={'title'}>
          {company?.name}
        </Link>
      </div>
      <p>{company?.description}</p>
      <ul className="footer-line">
        <li>
          <Link to={`/companies/${company?.id}`} className={'styled-btn'}>
            More details
          </Link>
        </li>
      </ul>

      <div className="line" />
    </StyledDiv>
  );
};

export default CompanyCard;
