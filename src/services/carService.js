// Importing necessary modules and services
import http from './httpService';
import config from '../config.json';
import authService from './authService';
const { apiUrl } = config;
const apiEndpoint = `${apiUrl}/car`;

// Function to create a new car entry
async function createCarData(carData) {
    const jwtToken = authService.getJwt();
    http.setJwt(jwtToken);

    return await http.post(`${apiEndpoint}/createCar`, carData);
}

// Function to get all cars for a specific user
async function getAllCarByUser(data) {
    const jwtToken = authService.getJwt();
    http.setJwt(jwtToken);

    return await http.post(`${apiEndpoint}/getAllCarsByUserId`, data);
}

// Function to delete a car entry by ID
async function deleteCarById(id) {
    const jwtToken = authService.getJwt();
    http.setJwt(jwtToken);

    console.log(id);
    return await http.delete(`${apiEndpoint}/${id}`);
}

// Function to get details of a single car by ID
async function getOneCarById(id) {
    const jwtToken = authService.getJwt();
    http.setJwt(jwtToken);

    return await http.get(`${apiEndpoint}/${id}`);
}

// Function to update a car entry by ID with new data
async function updateCar(id, body) {
    const jwtToken = authService.getJwt();
    http.setJwt(jwtToken);

    return await http.put(`${apiEndpoint}/${id}`, body);
}

// Exporting the functions for use in other modules
export default {
    createCarData,
    getAllCarByUser,
    deleteCarById,
    getOneCarById,
    updateCar,
};
