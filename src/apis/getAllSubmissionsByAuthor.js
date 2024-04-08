import axios from "axios";

const getAllSubmissionsByAuthor = async (id) => {
    const response = await axios.get('http://localhost:5000/api/getAllSubmissionsByAuthor/'+id);
    return response;
}

export default getAllSubmissionsByAuthor;