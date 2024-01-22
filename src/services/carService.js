import http from './httpService';
import config from '../config.json';
import authService from './authService';
const { apiUrl } = config;
const apiEndpoint = `${apiUrl}/car`;
const jwtToken = authService.getJwt();
http.setJwt(jwtToken);

async function createCarData(carData) {
    return await http.post(`${apiEndpoint}/createCar`, carData);
}
async function getAllCarByUser(data) {
    // console.log('enter to get all the cars', userId);
    return await http.post(`${apiEndpoint}/getAllCarsByUserId`, data);
}
async function deleteCarById(id) {
    // console.log('enter to get all the cars', userId);
    console.log(id);
    return await http.delete(`${apiEndpoint}/${id}`);
}
async function getOneCarById(id) {
    // console.log('enter to get all the cars', userId);
    console.log(id);
    return await http.get(`${apiEndpoint}/${id}`);
}
async function updateCar(id, body) {
    // console.log('enter to get all the cars', userId);
    console.log(id);
    return await http.put(`${apiEndpoint}/${id}`, body);
}
export default {
    createCarData,
    getAllCarByUser,
    deleteCarById,
    getOneCarById,
    updateCar,
};
