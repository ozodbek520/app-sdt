import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from './UI/GlobalStyle';
import { ToastContainer } from 'react-toastify';
import { CustomRoutes } from './router';
import ScrollToTop from './helper/ScrollToTop';
import Layout from './layouts/layout/Layout';

function App() {
  return (
    <>
      <ToastContainer />
      <GlobalStyle />
      <Router>
        <ScrollToTop />
        <Layout>
          <CustomRoutes />
        </Layout>
      </Router>
    </>
  );
}

export default App;
