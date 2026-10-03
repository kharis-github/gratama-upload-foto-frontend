import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const post = (endpoint, payload, config) =>
  axios.post(`${apiBaseUrl}/api/${endpoint}`, payload, config)

export const imageUploadModel = {
  fetchDealers: (payload) => post('dealer', payload), // fetch daftar dealer
  fetchNopols: (payload) => post('nopol', payload), // fetch daftar nopol berdasarkan dealer
  fetchRO: (payload) => post('ro', payload), // fetch daftar RO berdasarkan nopol
  fetchOdometer: (payload) => post('odometer', payload), // fetch data odometer unit
  fetchPencairan: (payload) => post('pencairan', payload), // fetch data pencairan unit
  fetchPembiayaan: (payload) => post('pembiayaan', payload), // fetch data pembiayaan unit
  fetchCabang: (payload) => post('cabang', payload), // fetch daftar cabang
  fetchAllPembiayaan: (payload) => post('pembiayaan/all', payload), // fetch semua data pembiayaan
  fetchImages: (payload) => post('images', payload), // fetch data gambar
  fetchDokumentasiImage: (payload) => post('dokimg', payload), // fetch data dokumentasi image untuk form upload image
  deleteImage: (payload) => post('images/delete', payload), // delete image
  updatePembiayaan: (payload) => post('pembiayaan/updatevalue: ', payload), // update data pembiayaan
  uploadBulk: (payload) => post('uploadbulk', payload, { // upload beberapa image sekaligus
    'Content-Type': 'multipart/form-data',
  }),
  uploadBulkLegacy: (payload) => post('uploadbulk2', payload, {
    'Content-Type': 'application/json',
  }),
}