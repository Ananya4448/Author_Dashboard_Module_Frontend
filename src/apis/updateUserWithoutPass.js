import axios from "axios";

const updateUserWithoutPass = async (payload) => {
    const response = await axios.put('http://localhost:5000/api/updateUserWithoutPass', payload);
    return response;
}

export default updateUserWithoutPass;