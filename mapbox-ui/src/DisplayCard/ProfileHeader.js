import React from 'react';

import FormField from '../Reusable/FormField';

const ProfileHeader = ({ textContents, configuration = 'left' }) => {
    return (
        <div className={`profile-header ${configuration}`}>
            <FormField
                value={textContents}
                isEditable={false}
                className="card-header"
            />
        </div>
    )
};

export default ProfileHeader;