import cx from 'classnames';

const TextareaField = ({
    className,
    hideLabel,
    label,
    name,
    onChange,
    value
}) => {
    return (
        <textarea
            className={cx('text-area', 'form-field', className)}
            placeholder={hideLabel ? label : ''}
            name={name}
            id={name}
            onChange={onChange}
            value={value}
        />
    );
};

export default TextareaField;