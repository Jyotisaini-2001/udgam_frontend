import axios from 'axios';

const API_URL = 'https://udgam-backend-host.onrender.com/products';
console.log()
const getProducts = () => {
  return axios.get(API_URL);
};

export default {
  getProducts,
};
