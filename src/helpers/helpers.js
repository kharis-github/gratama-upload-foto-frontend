import router from "@/router";

// ekstraksi waktu expiration token
export function getTokenExpiration(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000; // ubah ke ms
    } catch (e) {
        return null;
    }
}

export function logout() {
    // Hapus token & user dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect ke login
    router.push('/login');
}

