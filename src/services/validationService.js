const validate = (data, schema) => {
    const options = { abortEarly: false };
    const { error } = schema.validate(data, options);
    if (!error) return null;

    const errors = {};
    for (const item of error.details) errors[item.path[0]] = item.message;
    return errors;
};

const validateProperty = ({ name, value }, schema) => {
    const obj = { [name]: value };

    const options = { abortEarly: false };
    const { error } = schema.validate(obj, options);
    if (!error) return null;

    for (const item of error.details) {
        if (item.path[0] === name) {
            return item.message;
        }
    }
    return null;
};

export default {
    validate,
    validateProperty,
};
