import cx from 'classnames';

const CheckboxField = ({
    className,
    name,
    value,
    onChange
}) => {
    return (
        <div className={cx('form-field', 'checkbox', className)}>
            <input
                className={'hidden-checkbox'}
                type='checkbox'
                id={name}
                name={name}
                value={value}
                onChange={onChange}
            />
            <div className="checkbox-illus" />
        </div>
    );
};

export default CheckboxField;