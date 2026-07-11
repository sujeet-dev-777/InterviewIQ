import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Credit Purchase App</h1>
            <p>Buy credits to enhance your experience!</p>
            <Link to="/buy-credits">
                <button>Buy Credits</button>
            </Link>
        </div>
    );
};

export default Home;