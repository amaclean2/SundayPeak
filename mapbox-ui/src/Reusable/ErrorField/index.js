import React from 'react';

const ErrorField = ({ error }) => {
    console.log("ERROR_FIELD", error);
    return (
        <div className="error-field">Error!</div>
    );
};

export default ErrorField;