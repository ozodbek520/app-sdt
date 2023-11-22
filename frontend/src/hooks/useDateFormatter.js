import { useIntl } from 'react-intl';

const useDateFormatter = () => {
  const intl = useIntl();

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return intl.formatDate(new Date(dateString), options);
  };

  return { formatDate };
};

export default useDateFormatter;
