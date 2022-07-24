import React from 'react';

import { FormField } from '../FormField';
import { Field } from '../FieldOrganizer';

export const HeaderSubtext = ({ children }) => (
    <span className="header-subtext">{children}</span>
);

export const ProfileHeader = ({
    textContents,
    configuration = 'left',
    editFields: {
        isEditable,
        propName,
        onChange
    } = {},
    children
}) => {
    return (
        <div className={`profile-header ${configuration}`}>
            {(isEditable)
                ? (
                    <FormField
                        value={textContents}
                        hideLabel
                        name={propName}
                        className="card-header"
                        isEditable={isEditable}
                        onChange={onChange}
                    />
                ) : (
                    <Field>
                        {children}
                    </Field>
                )
            }
        </div>
    )
};