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
async function getAllCarByUser(userId) {
    console.log('enter to get all the cars', userId);
    return await http.get(`${apiEndpoint}/${userId}`);
}

export default {
    createCarData,
    getAllCarByUser,
};
