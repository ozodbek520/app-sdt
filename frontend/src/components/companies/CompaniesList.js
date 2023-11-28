import React from 'react';
import { useSelector } from 'react-redux';
import NoData from '../../UI/NoData';
import styled from 'styled-components';
import CompanyCard from './CompanyCard';

const StyledDiv = styled.div``;

const CompaniesList = () => {
  const { companiesList, loading } = useSelector((state) => state.application);

  return (
    <StyledDiv>
      {!loading && companiesList.length === 0 ? (
        <NoData />
      ) : (
        companiesList.map((company) => <CompanyCard key={company.id} company={company} />)
      )}
    </StyledDiv>
  );
};

export default CompaniesList;
