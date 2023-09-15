import axios from 'axios'

// Create an Axios instance with default configuration
const instance = axios.create({
  baseURL: 'https://j1mmfot0ad.execute-api.us-east-1.amazonaws.com',
  headers: {
    'Content-Type': 'application/json', // Set the default content-type header
  },
})

// You can also add additional default configuration options here if needed

export default instance
