import axios from "axios";

const addUser = async (payload) => {
    const response = await axios.post('http://localhost:5000/api/addUser', payload);
    return response;
}

export default addUser;