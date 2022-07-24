import { Field, FieldHeader } from "../Reusable";

const StatTemplate = ({ statLabel = '', statValue = ''}) => {

    return (
        <Field className="stat-template">
            <FieldHeader text={statLabel} />
            {statValue}
        </Field>
    );
};

export default StatTemplate;