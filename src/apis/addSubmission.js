import axios from "axios";

const addSubmission = async (payload) => {
    const response = await axios.post('http://localhost:5000/api/addSubmission', payload);
    return response;
}

export default addSubmission;