import { useIntl } from 'react-intl';

const useDateFormatter = () => {
  const intl = useIntl();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return intl.formatDate(date, options);
  };

  return { formatDate };
};

export default useDateFormatter;
