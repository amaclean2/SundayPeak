import React from 'react';
import cx from 'classnames';

import './styles.css';

export const Button = ({
    onClick = () => {},
    className,
    children,
    id = 'basic-button',
    secondaryButton = ''
}) => {

    const handleClick = (e) => {
        console.log(`button ${id} clicked`);
        onClick(e);
    };

    return (
        <button id={id} onClick={handleClick} className={cx('button', className, (secondaryButton && 'secondary-button'))} >
            {children}
        </button>
    );
};