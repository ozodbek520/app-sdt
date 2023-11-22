import queryString from 'query-string';

export const parsedSearchParams = (val) => queryString.parse(window.location.search)[val] || '';
