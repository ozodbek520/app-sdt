import React from 'react';
import Header from '../../components/header/Header';
import CenterBox from '../../UI/CenterBox';
import { fetchBestCompaniesList } from '../../store/reducers/applicationSlice';
import useFetchByAction from '../../hooks/useFetchByAction';
import CompaniesList from '../../components/companies/CompaniesList';

const Companies = () => {
  useFetchByAction(fetchBestCompaniesList);

  return (
    <CenterBox>
      <Header title={'Companies'} icon={'🏢'} />
      <CompaniesList />
    </CenterBox>
  );
};

export default Companies;
