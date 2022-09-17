import React from 'react';
import { Link } from 'react-router-dom';

import { CARD_STATES, useCardStateContext, useUserStateContext } from "../Providers";

const LandingPageHeader = () => {
    const { clickOffLanding } = useUserStateContext();
    const { openCard } = useCardStateContext();

    const handleOpenLogin = () => {
        openCard(CARD_STATES.login);
    };

    const handleOpenSignUp = () => {
        openCard(CARD_STATES.signup);
    };

    return (
        <div className="flex-box">
            <h1>Backyard Friends</h1>
            <div className="flex-spacer" />
            <div className="action-buttons">
                <Link to="/discover" className="button" onClick={handleOpenLogin}>
                    Log In
                </Link>
                <Link to="/discover" className="button" onClick={handleOpenSignUp}>
                    Create an Account
                </Link>
            </div>
        </div>
    )
};

export default LandingPageHeader;