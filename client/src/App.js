import React, { Fragment } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home/Home';
import About from './components/pages/About';
import TweetsState from './context/Tweets/TweetsState';

const App = () => {
  return (
    <TweetsState>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/about' exact component={About} />
          </Switch>
        </Fragment>
      </BrowserRouter>
    </TweetsState>
  );
};

export default App;
