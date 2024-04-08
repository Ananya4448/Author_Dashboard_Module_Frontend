import axios from "axios";

const logIn = async (payload) => {
    const response = await axios.post('http://localhost:5000/api/login', payload);
    return response;
}

export default logIn;