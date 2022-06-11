import React, { useEffect, useState } from 'react';

import { useUserStateContext } from '../../../Providers';

import './styles.css';

export const ErrorField = ({ form }) => {
    const { loginError } = useUserStateContext();
    const [error, setError] = useState('');

    useEffect(() => {
        console.log("LOGIN_ERROR_STATE", loginError);
        switch (form) {
            case 'login':
                setError(loginError);
                break;
            default:
                setError('');
                break;
        };
    }, [loginError]);

    return (
        <span className={`${(!!error) ? '' : 'collapsed'} error-field`}>{error}</span>
    );
};