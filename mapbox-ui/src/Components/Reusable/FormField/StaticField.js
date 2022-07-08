import cx from 'classnames';

const StaticField = ({
    name,
    value,
    type,
    className,
    options
}) => {
    const formattedSuffix = (options?.suffix)
        ? ` ${options.suffix}`
        : '';

    if (options?.selectMany) {
        console.log("VALUE", value, "NAME", name);
        const parsedSelection = (typeof value === "string") ? JSON.parse(value) : value;
        return (
            <div className={cx(type, className, 'form-field-static')}>
                {parsedSelection.map((value, key) => (
                    <span
                        key={`selection_value_${key}`}
                        className={'selection-value'}
                    >
                        {`${options.selectMany.find(({value: optionValue}) => optionValue === Number(value)).name}, `}
                    </span>
                ))}
            </div>
        )
    }

    return (
        <span className={cx(type, className, 'form-field-static')}>{`${value}${formattedSuffix}`}</span>
    );
};

export default StaticField;