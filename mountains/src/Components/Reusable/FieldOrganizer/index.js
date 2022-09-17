import cx from 'classnames';

import './styles.css';

export const FieldPage = ({ children, className }) => {
    return (
        <div className={cx(className, 'field-page flex-box')}>
            {children}
        </div>
    );
};

export const FieldRow = ({ children, className, borderBottom }) => {
    return (
        <div className={cx(className, (borderBottom && 'border-bottom'), 'field-row flex-box')}>
            {children}
        </div>
    );
};

export const Field = ({ children, className, borderRight }) => {
    return (
        <div className={cx(className, (borderRight && 'border-right'), 'field flex-box')}>
            {children}
        </div>
    );
};

export const FieldHeader = ({ text, children, className }) => {
    return (
        <h3 className={cx(className, 'field-header flex-box')}>
            {text || children}
        </h3>
    );
};