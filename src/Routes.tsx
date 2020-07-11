import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Repository from './pages/Repository';

const Routes: React.FC = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/repository/:repository+" component={Repository} />
        </Switch>
    </BrowserRouter>
);

export default Routes
