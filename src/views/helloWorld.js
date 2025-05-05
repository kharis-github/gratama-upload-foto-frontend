import axios from 'axios'

// testing integrasi front-end dan back-end
axios.get('http://localhost:8080/api/ping')
  .then(res => {
    console.log(res.data)
  })