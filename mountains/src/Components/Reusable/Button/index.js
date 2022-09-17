import React from 'react';
import cx from 'classnames';

import './styles.css';

export const Button = ({
    onClick = () => {},
    className,
    children,
    disabled,
    id = 'basic-button',
    secondaryButton = '',
    small = false
}) => {

    const handleClick = (e) => {
        console.log(`button ${id} clicked`);
        onClick(e);
    };

    return (
        <button id={id}
            disabled={disabled}
            onClick={handleClick}
            className={cx('button', 'flex-box', className, (secondaryButton && 'secondary-button'), (small && 'small'))}
        >
            {children}
        </button>
    );
};