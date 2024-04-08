import axios from "axios";

const deleteSubmission = async (id) => {
    const response = await axios.delete('http://localhost:5000/api/deleteSubmission/'+id);
    return response;
}

export default deleteSubmission;