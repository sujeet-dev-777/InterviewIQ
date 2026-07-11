import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import BuyCredits from './pages/BuyCredits';
import './styles/globals.css';

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/buy-credits" component={BuyCredits} />
            </Switch>
        </Router>
    );
};

export default App;