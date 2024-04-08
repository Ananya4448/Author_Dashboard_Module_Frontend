import axios from "axios";

const getUserById = async (id) => {
    const response = await axios.get('http://localhost:5000/api/getUserById/'+id);
    return response;
}

export default getUserById;