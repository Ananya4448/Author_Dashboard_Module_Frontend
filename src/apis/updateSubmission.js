import axios from "axios";

const updateSubmission = async (payload) => {
    const response = await axios.put('http://localhost:5000/api/updateSubmission', payload);
    return response;
}

export default updateSubmission;