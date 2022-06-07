import React from 'react';

import './styles.css';

const ErrorField = ({ error }) => {
    return (
        <span className="error-field">{error}</span>
    );
};

export default ErrorField;