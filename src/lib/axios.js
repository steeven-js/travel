import Axios from 'axios'

const axios = Axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withXSRFToken: true,
    withCredentials: true,
})

export default axios
