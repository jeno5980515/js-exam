import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import PageWrapper from './PageWrapper';

import LoginPage from 'app/pages/LoginPage';
import ExamPage from 'app/pages/ExamPage';

const { PUBLIC_URL } = process.env;

const App = () => (
  <Router basename={PUBLIC_URL}>
    <PageWrapper>
      <Route exact path="/" component={ExamPage} />
      <Route exact path="/login" component={LoginPage} />
    </PageWrapper>
  </Router>
);

export default App;
