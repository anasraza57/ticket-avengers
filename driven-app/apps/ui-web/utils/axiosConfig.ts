import axios from 'axios'

const baseURL = process.env['NEXT_PUBLIC_API_BASE_URL']

// Create an Axios instance with default configuration
const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json', // Set the default content-type header
  },
})

// You can also add additional default configuration options here if needed

export default instance
