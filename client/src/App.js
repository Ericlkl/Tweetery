import React, { Fragment } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home/Home';
import About from './components/pages/About';
const App = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/about' exact component={About} />
        </Switch>
      </Fragment>
    </BrowserRouter>
  );
};

export default App;
