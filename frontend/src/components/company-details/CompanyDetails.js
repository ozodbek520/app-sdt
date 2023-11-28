import React, { useEffect } from 'react';
import CenterBox from '../../UI/CenterBox';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchCompanyDetailsById } from '../../store/reducers/applicationSlice';

const StyledDiv = styled.div`
  margin-top: 8rem;

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
      margin-bottom: 24px;

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

const CompanyDetails = () => {
  const dispatch = useDispatch();
  const { companyDetails } = useSelector((state) => state.application);

  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchCompanyDetailsById(id));
  }, [dispatch, id]);

  return (
    <CenterBox>
      <StyledDiv>
        <div className="card-header">
          <img
            className="logo-box"
            src={companyDetails?.companyLogoURL}
            alt={companyDetails?.name}
          />
          <h4 className={'title'}>{companyDetails?.name}</h4>
        </div>
        <p>{companyDetails?.description}</p>
        <ul className="footer-line">
          <li>
            <a
              href={`${companyDetails?.officialSiteURL}`}
              target="_blank"
              rel="noreferrer"
              className={'styled-btn'}
            >
              Official website
            </a>
          </li>
          <li>Headquarter 📍: {companyDetails?.location}</li>
        </ul>
        <h5>Games list</h5>
        <ul className="footer-line">
          {companyDetails?.games.map((game) => (
            <li key={game.id}>
              <Link to={`/game-details/${game?.id}`} className={'styled-btn styled-game-btn'}>
                {game.title}
              </Link>
            </li>
          ))}
        </ul>
      </StyledDiv>
    </CenterBox>
  );
};

export default CompanyDetails;
