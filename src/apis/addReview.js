import axios from "axios";

const addReview = async (payload) => {
    const response = await axios.post('http://localhost:5000/api/addReview', payload);
    return response;
}

export default addReview;