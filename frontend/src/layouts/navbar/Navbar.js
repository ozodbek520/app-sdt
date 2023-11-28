import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import CenterBox from '../../UI/CenterBox';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import useDebounce from '../../hooks/useDebounce';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchParam } from '../../store/reducers/applicationSlice';
import { paramsMap } from '../../const';

const StyledNavbar = styled.div`
  position: fixed;
  width: inherit;
  top: 0;
  z-index: 1;

  nav {
    background: #20202380;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    .navbar-brand {
      font-family: 'soleil', sans-serif;
      font-weight: 700;
      letter-spacing: 2px;
      color: #ff62c2;

      .logo {
        width: 48px;
      }
    }
  }
`;

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const param = paramsMap[pathname];
  const dispatch = useDispatch();
  const { search } = useSelector((state) => state.application);
  const [searchTerm, setSearchTerm] = useState(search[param]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleDispatch = useCallback(
    (value) => {
      if (!value) {
        navigate(pathname);
      } else {
        navigate(`${pathname}?search_${param}=${value}`);
      }
      dispatch(setSearchParam({ param, value }));
    },
    [dispatch, navigate, param, pathname]
  );

  useEffect(() => {
    handleDispatch(debouncedSearchTerm);
  }, [debouncedSearchTerm, handleDispatch]);

  return (
    <CenterBox>
      <StyledNavbar>
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src={Logo} alt="logo" className="logo" />️
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarTogglerDemo02"
              aria-controls="navbarTogglerDemo02"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link" to={'/'} activeclassname="active" exact={'true'}>
                    Games
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={'/players'} activeclassname="active">
                    Players
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={'/companies'} activeclassname="active">
                    Companies
                  </NavLink>
                </li>
              </ul>
              <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-success" type="button">
                  🔍
                </button>
              </form>
            </div>
          </div>
        </nav>
      </StyledNavbar>
    </CenterBox>
  );
}

export default Navbar;
