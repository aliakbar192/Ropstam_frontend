// Function to validate an entire object against a Joi schema
const validate = (data, schema) => {
    // Validation options to collect all errors
    const options = { abortEarly: false };

    // Validate the data against the schema
    const { error } = schema.validate(data, options);

    // If there are errors, format them into an object
    if (error) {
        const errors = {};
        for (const item of error.details) {
            errors[item.path[0]] = item.message;
        }
        return errors;
    }

    // If there are no errors, return null
    return null;
};

// Function to validate a specific property of an object against a Joi schema
const validateProperty = ({ name, value }, schema) => {
    // Create an object with a single property for validation
    const obj = { [name]: value };

    // Validation options to collect all errors
    const options = { abortEarly: false };

    // Validate the property against the schema
    const { error } = schema.validate(obj, options);

    // If there are errors, find the error related to the specific property
    if (error) {
        for (const item of error.details) {
            if (item.path[0] === name) {
                return item.message;
            }
        }
    }

    // If the specific property is not found in the errors, return null
    return null;
};

// Export the validation functions for use in other modules
export default {
    validate,
    validateProperty,
};
