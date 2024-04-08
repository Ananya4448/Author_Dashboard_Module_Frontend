import axios from "axios";

const getUserByEmail = async (email) => {
    const response = await axios.get('http://localhost:5000/api/getUserByEmail/'+email);
    return response;
}

export default getUserByEmail;