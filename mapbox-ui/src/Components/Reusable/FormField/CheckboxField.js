import cx from 'classnames';

const CheckboxField = ({
    className,
    name,
    value,
    onChange
}) => {

    const handleChange = (e) => {
        return onChange({
            target: {
                value: e.target.checked,
                name: e.target.name
            }
        });
    };

    return (
        <div className={cx('form-field', 'checkbox', className)}>
            <input
                className={'hidden-checkbox'}
                type='checkbox'
                id={name}
                name={name}
                checked={value}
                onChange={handleChange}
            />
            <div className="checkbox-illus" />
        </div>
    );
};

export default CheckboxField;