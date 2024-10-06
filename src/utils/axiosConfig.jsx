import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7288", // Replace with your API base URL
});

export default instance;
