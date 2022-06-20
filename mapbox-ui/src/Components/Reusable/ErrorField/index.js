import React, { useEffect, useState } from 'react';

import { useAdventureEditContext, useUserStateContext } from '../../../Providers';

import './styles.css';

export const ErrorField = ({ form }) => {
    const { loginError } = useUserStateContext();
    const { adventureError } = useAdventureEditContext();
    const [error, setError] = useState('');

    useEffect(() => {
        switch (form) {
            case 'login':
                setError(loginError);
                break;
            case 'adventure':
                setError(adventureError);
                break;
            default:
                setError('');
                break;
        }
    }, [loginError, adventureError]);

    return (
        <span className={`${(!!error) ? '' : 'collapsed'} error-field`}>{error}</span>
    );
};