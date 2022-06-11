import React from 'react';

import { CARD_STATES, useCardStateContext, useUserStateContext } from "../Providers";

const LandingPageHeader = () => {
    const { clickOffLanding } = useUserStateContext();
    const { openCard } = useCardStateContext();

    const handleOpenLogin = () => {
        clickOffLanding();
        openCard(CARD_STATES.login);
    };

    const handleOpenSignUp = () => {
        clickOffLanding();
        openCard(CARD_STATES.signup);
    };

    return (
        <div className="flex-box">
            <h1>Backyard Friends</h1>
            <div className="flex-spacer" />
            <div className="action-buttons">
                <button className="button" onClick={handleOpenLogin}>
                    Log In
                </button>
                <button className="button" onClick={handleOpenSignUp}>
                    Create an Account
                </button>
            </div>
        </div>
    )
};

export default LandingPageHeader;