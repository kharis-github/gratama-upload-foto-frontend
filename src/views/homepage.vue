<template>
    <v-container class="mt-10">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <h1>{{ message }}</h1>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'Homepage',
    data() {
      return {
        message: ''
      }
    },
    mounted() {	
      axios.get(`${import.meta.env.VITE_API_BASE}/api/message`)
        .then(res => {
          // this.message = res.data.message
          console.log("Response: ", res.data)
        })
        .catch(err => {
          console.error('Gagal mengambil pesan:', err)
        })
    }
  }
  </script>
  
  <style scoped>
  h1 {
    font-weight: bold;
  }
  </style>
  