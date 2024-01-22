import axios from 'axios';
import { toast } from 'react-toastify';

// Axios response interceptor to handle success and unexpected errors
axios.interceptors.response.use(
    (response) => {
        // Check if the response indicates an error
        const expectedError =
            !response || !response.data || !response.data.code || response.data.code < 200 || response.data.code >= 300;

        if (expectedError) {
            // Log the error details and reject the promise
            console.log(response.data);
            return Promise.reject(response.data);
        }

        // Return the response for successful requests
        return response;
    },
    (error) => {
        // Check if the error is an expected client-side error
        const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

        if (!expectedError) {
            // Log the unexpected error and display a toast notification
            console.log(error);
            toast.error('An unexpected error occurred.');
        }

        // Reject the promise with the error details
        return Promise.reject(error);
    },
);

// Function to set JWT token for authorization headers
function setJwt(jwt) {
    if (jwt) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt;
    }
}

// Exporting Axios methods and setJwt function
export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt,
};
