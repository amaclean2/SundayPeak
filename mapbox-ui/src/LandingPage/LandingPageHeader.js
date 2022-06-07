import React from 'react';

import { useCardStateContext } from "../Providers/cardStateProvider";
import { useUserStateContext } from "../Providers/userStateProvider";

const LandingPageHeader = () => {
    const { clickLogin } = useUserStateContext();
    const { openCard } = useCardStateContext();

    const handleOpenLogin = () => {
        clickLogin();
        openCard('login');
    };

    return (
        <div className="flex-box">
            <h1>Backyard Friends</h1>
            <div className="flex-spacer" />
            <div className="action-buttons">
                <button className="button" onClick={handleOpenLogin}>
                    Log In
                </button>
                <button className="button">
                    Create an Account
                </button>
            </div>
        </div>
    )
};

export default LandingPageHeader;