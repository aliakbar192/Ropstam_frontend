import { toast } from 'react-toastify';

// Function to display an error toast
function error(data) {
    toast.error(data);
}

// Function to display a warning toast
function warning(data) {
    toast.warning(data);
}

// Function to display a success toast
function success(data) {
    toast.success(data);
}

// Function to display an info toast
function info(data) {
    toast.info(data);
}

// Exporting the toast functions for use in other modules
export default {
    error,
    warning,
    success,
    info,
};
