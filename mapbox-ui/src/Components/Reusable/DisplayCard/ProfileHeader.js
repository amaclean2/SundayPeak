import React from 'react';
import cx from 'classnames';

import { FormField } from '../FormField';

export const ProfileHeader = ({ textContents, configuration = 'left', textClassName, editFields: {isEditable, propName, onChange} = {} }) => {
    return (
        <div className={`profile-header ${configuration}`}>
            {(!!onChange)
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
                    <FormField
                        value={textContents}
                        isEditable={false}
                        className={cx('card-header', textClassName)}
                    />
                )
            }
        </div>
    )
};