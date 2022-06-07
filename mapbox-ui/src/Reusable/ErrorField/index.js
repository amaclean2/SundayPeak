import React, { useEffect, useState } from 'react';
import { useUserStateContext } from '../../Providers/userStateProvider';

import './styles.css';

const ErrorField = ({ form,  }) => {
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

export default ErrorField;