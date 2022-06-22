import cx from 'classnames';

const RangeInputField = ({
    className,
    name,
    value,
    options,
    onChange
}) => {
    return (
        <input
            type="range"
            className={cx('slider', 'form-field', className)}
            name={name}
            id={name}
            value={value}
            min={options?.range?.min}
            max={options?.range?.max}
            step={options?.range?.step}
            onChange={onChange}
        />
    );
};

export default RangeInputField;