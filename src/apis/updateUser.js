import axios from "axios";

const updateUser = async (payload) => {
    const response = await axios.put('http://localhost:5000/api/updateUser', payload);
    return response;
}

export default updateUser;