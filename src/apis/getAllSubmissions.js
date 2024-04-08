import axios from "axios";

const getAllSubmissions = async () => {
    const response = await axios.get('http://localhost:5000/api/getAllSubmissions');
    return response;
}

export default getAllSubmissions;