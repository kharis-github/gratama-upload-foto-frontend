<template>
    <div>
        <v-container grid-list-md>
            <v-card elevation="4" outlined shaped max-width="31.25rem" class="mx-auto" style="margin-top: 10%;">
                <v-card-title primary-title>
                    Login Page
                </v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="submitLogin">
                        <v-text-field v-model="userid" label="User ID" />
                        <v-text-field v-model="password" label="Password" type="password" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn class="mx-auto" type="submit" @click="submitLogin">Login</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { logout } from '@/helpers/helpers';
import { getTokenExpiration } from '@/helpers/helpers';

export default {
    name: 'LoginPage',
    components: {},
    setup() {
        const userid = ref('')
        const password = ref('')

        const submitLogin = async () => {
            try {
                const response = await axios.post('http://localhost:8080/api/login', {
                    userid: userid.value,
                    password: password.value,
                })
                // cek keberhasilan
                if (response.status === 200) {
                    // notifikasi user
                    Swal.fire({
                        icon: "success",
                        title: "Login Success!",
                        text: `Selamat datang ${response.data.user.username}!`,
                        // footer: '<a href="#">Why do I have this issue?</a>'
                    }).then((result) => {
                        // REDIRECT
                        router.push('/')
                    });

                    const token = response.data.token // data token
                    const user = response.data.user // data user

                    // insert token dan data persistent
                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(user))

                    setAutoLogout(token) // setting auto logout expiration token
                }

            } catch (error) {
                console.log("Authentication Error: ", error)
                Swal.fire({
                    icon: "error",
                    title: "Login Gagal!",
                    text: error.response?.data?.message,
                    // footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        }

        // setting timer logout otomatis berdasarkan batas waktu token
        const setAutoLogout = (token) => {
            const expTime = getTokenExpiration(token);
            const now = Date.now();
            const timeout = expTime - now;

            if (timeout > 0) {
                setTimeout(() => {
                    logout();
                }, timeout);
            } else {
                logout(); // token sudah expired
            }
        }


        return {
            userid,
            password,
            submitLogin,
            setAutoLogout,
            getTokenExpiration
        }
    }
}
</script>