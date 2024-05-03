import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'https://breeze-api.jsprod.fr',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true
})

export default axios
