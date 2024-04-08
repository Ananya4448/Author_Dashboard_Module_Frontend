import axios from "axios";

const getAllStatus = async () => {
    const response = await axios.get('http://localhost:5000/api/getAllStatus');
    return response;
}

export default getAllStatus;