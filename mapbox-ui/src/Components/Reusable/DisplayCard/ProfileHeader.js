import React from 'react';
import cx from 'classnames';

import { FormField } from '../FormField';

export const ProfileHeader = ({ textContents, configuration = 'left', textClassName }) => {
    return (
        <div className={`profile-header ${configuration}`}>
            <FormField
                value={textContents}
                isEditable={false}
                className={cx('card-header', textClassName)}
            />
        </div>
    )
};