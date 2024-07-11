import axios from 'axios';

const API_URL = 'http://localhost:3000/products';
console.log()
const getProducts = () => {
  return axios.get(API_URL);
};

export default {
  getProducts,
};
