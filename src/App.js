import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LoginPage from 'app/pages/LoginPage';
import ExamPage from 'app/pages/ExamPage';

const { PUBLIC_URL } = process.env;

const App = () => (
  <Router basename={PUBLIC_URL}>
    <div>
      <Route exact path="/" component={ExamPage} />
      <Route exact path="/login" component={LoginPage} />
    </div>
  </Router>
);

export default App;
