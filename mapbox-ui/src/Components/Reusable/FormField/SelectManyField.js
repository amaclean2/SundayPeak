import cx from 'classnames';

const SelectManyField = ({
    className,
    options,
    onChange
}) => {
    return (
        <div className={cx('form-field', 'select-many', 'flex-box', className)}>
            {
                options?.selectMany?.map((option, key) => (
                    <label htmlFor={option.name} className={cx('select-many-option', 'flex-box')} key={`select_many_option_${key}`}>
                        <input
                            type='checkbox'
                            name={option.name}
                            id={option.name}
                            value={option.value}
                            className={'hidden-checkbox'}
                            onChange={onChange}
                        />
                        <div className="select-many-illus" />
                        {option.name}
                    </label>
                ))
            }
        </div>
    );
};

export default SelectManyField;