<template>
  <v-container>
    <v-container grid-list-md justify="center">
      <v-card elevation="4" outlined shaped max-width="50rem" class="mx-auto" style="margin-top: 10%;">
        <v-card-title primary-title>
          <b>Upload Image Untuk Pencairan</b>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Pilih Pembiayaan..." @click="getAllPembiayaan" readonly></v-text-field>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- <v-text-field label="Pilih Dealer..." @click="getDealers" readonly></v-text-field> -->

    <!-- 1 | Field Input Dealer -->
    <v-dialog v-model="dealerDialog" max-width="800px">
      <v-card>
        <v-card-title>
          Daftar Dealer
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="closeDialog('daftar-data')"></v-btn>
        </v-card-title>

        <v-card-text>
          <!-- TODO: Search data dealer -->
          <v-text-field v-model="dealerQuery" name="search" label="Search..." prepend-inner-icon="mdi-magnify"
            id="dealersearch" clearable @input="dealerSearch"></v-text-field>
          <v-data-table :headers="headers" :items="dealerList" :loading="loading" loading-text="Mengambil data..."
            class="elevation-1" @click:row="onRowClickPencairan">
            <template #item="{ item }">
              <tr @click="onRowClickPencairan(item)" style="cursor: pointer;">
                <td>{{ item.noregfas }}</td>
                <td>{{ item.nama }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- LIST PEMBIAYAAN -->

    <v-dialog v-model="dialogListPembiayaan" max-width="1000px">
      <v-card>
        <v-card-title>
          List Pencairan
          <v-spacer></v-spacer>
          <v-row justify="center">
            <v-col cols="12">
              <v-btn class="ms-auto" text="Close" @click="closeDialog('list-pembiayaan')"></v-btn>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <v-autocomplete :items="cabangList" item-title="label" item-value="value" v-model="selectedCabang"
                label="Daftar Cabang" @update:model-value="onPembiayaanParameterChange"></v-autocomplete>
            </v-col>
          </v-row>
          <!-- Search Field -->
          <v-spacer></v-spacer>
          <v-row justify="center">
            <!-- Search Field Nama Dealer -->
            <v-col>
              <v-text-field v-model="nmDealerSearch" name="nmdealersearch" label="Search Nama Dealer"
                prepend-inner-icon="mdi-magnify" id="nmdealersearch"
                @input="onPembiayaanParameterChange"></v-text-field>
            </v-col>
            <!-- Search Field Nomor Polisi -->
            <v-col>
              <v-text-field v-model="nopolSearch" name="nopolsearch" label="Search No. Polisi"
                prepend-inner-icon="mdi-magnify" id="nopolsearch" @input="onPembiayaanParameterChange"></v-text-field>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text>
          <v-data-table :headers="pembiayaanHeaders" :items="listPembiayaanValues" :loading="loading"
            loading-text="Mengambil data..." class="elevation-1">
            <template #item="{ item }">
              <tr @click="onRowClickPembiayaan(item)" style="cursor: pointer;">
                <td>{{ item.kode }}</td>
                <td>{{ item.nopol }}</td>
                <td>{{ item.nmdealer }}</td>
                <td>{{ item.jnsproduk }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- PENCAIRAN DETAILS DIALOG -->
    <v-dialog v-model="dialogPencairan" scrollable persistent :overlay="false" max-width="800"
      transition="dialog-transition">
      <v-card>
        <v-card-title primary-title>
          Detail Dealer
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="closeDialog('pencairan')"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field name="nodealer" label="No. Dealer" id="nodealer"
              v-model="pencairanBody.nodealer"></v-text-field>
            <v-text-field name="outstanding" label="Outstanding" id="outstanding"
              v-model="pencairanBody.outstanding"></v-text-field>
            <v-text-field name="nmdealer" label="Nama Dealer" id="nmdealer"
              v-model="pencairanBody.nmdealer"></v-text-field>
            <v-text-field name="nmdebitur" label="Nama Pemilik" id="nmdebitur"
              v-model="pencairanBody.nmdebitur"></v-text-field>
            <v-text-field name="marketing" label="marketing" id="marketing"
              v-model="pencairanBody.marketing"></v-text-field>
            <v-text-field name="jthtempomou" label="Jatuh Tempo MOU" id="jthtempomou"
              v-model="pencairanBody.jthtempomou"></v-text-field>
            <v-text-field name="plafond" label="Plafond" id="planfond" v-model="pencairanBody.plafond"></v-text-field>
            <v-text-field name="plfsisa" label="Plafond Sisa" id="plfsisa"
              v-model="pencairanBody.plfsisa"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="getPembiayaan">Show List</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- PEMBIAYAAN DETAILS DIALOG -->
    <v-dialog v-model="dialogPembiayaan" scrollable persistent :overlay="false" max-width="800"
      transition="dialog-transition">
      <v-card>
        <v-card-title primary-title>
          Detail Unit
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="closeDialog('pembiayaan-dealer')"></v-btn>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="updatePembiayaan">
            <v-text-field name="tgltrn" label="Tanggal Pencairan" id="tgltrn"
              v-model="pembiayaanBody.tgltrn"></v-text-field>
            <v-text-field name="jnsproduk" label="Jenis Produk" id="jnsproduk"
              v-model="pembiayaanBody.jnsproduk"></v-text-field>
            <v-text-field name="jnskend" label="Jenis Kendaraan" id="jnskend"
              v-model="pembiayaanBody.jnskend"></v-text-field>
            <v-text-field name="merkkend" label="Merk" id="merkkend" v-model="pembiayaanBody.merkkend"></v-text-field>
            <v-text-field name="thnbuat" label="Tahun Buat" id="thnbuat"
              v-model="pembiayaanBody.thnbuat"></v-text-field>
            <v-text-field name="warna" label="Warna" id="warna" v-model="pembiayaanBody.warna"></v-text-field>
            <v-text-field name="tipekend" label="Tipe" id="tipekend" v-model="pembiayaanBody.tipekend"></v-text-field>
            <v-text-field name="nopol" label="No. Polisi" id="nopol" v-model="pembiayaanBody.nopol"></v-text-field>
            <v-text-field name="nobpkb" label="No. BPKB" id="nobpkb" v-model="pembiayaanBody.nobpkb"></v-text-field>
            <v-text-field name="odometer" label="Odometer" id="odometer"
              v-model="pembiayaanBody.odometer"></v-text-field>
            <v-text-field name="konkend" label="Kondisi Kendaraan" id="konkend"
              v-model="pembiayaanBody.konkend"></v-text-field>
            <v-text-field name="nlpasar" label="Nilai Pasar" id="nlpasar"
              v-model="pembiayaanBody.nlpasar"></v-text-field>
            <v-text-field name="nominal" label="Nilai Pokok" id="nominal"
              v-model="pembiayaanBody.nominal"></v-text-field>
            <v-text-field name="persen" label="Persen Pokok" id="persen" v-model="pembiayaanBody.persen"></v-text-field>

            <v-checkbox name="bpkbflg" label="BPKB Asli" id="bpkbflg" v-model="pembiayaanBody.bpkbflg"></v-checkbox>
            <v-checkbox name="faktura" label="Faktur Asli" id="faktura" v-model="pembiayaanBody.faktura"></v-checkbox>
            <v-checkbox name="ktpflg" label="KTP (BPKB)" id="ktpflg" v-model="pembiayaanBody.ktpflg"></v-checkbox>
            <v-checkbox name="nikflg" label="NIK Asli" id="nikflg" v-model="pembiayaanBody.nikflg"></v-checkbox>
            <v-checkbox name="stnkflg" label="STNK Copy" id="stnkflg" v-model="pembiayaanBody.stnkflg"></v-checkbox>
            <v-checkbox name="kwitansiflg" label="Kwitansi Kosong Bermaterai" id="kwitansiflg"
              v-model="pembiayaanBody.kwitansiflg"></v-checkbox>
            <v-checkbox name="nokanosin" label="Esek-Esek Noka Nosin" id="nokanosin"
              v-model="pembiayaanBody.nokanosin"></v-checkbox>
            <v-checkbox name="sphflg" label="Surat Pelepasan Hak" id="sphflg"
              v-model="pembiayaanBody.sphflg"></v-checkbox>
            <v-checkbox name="kwjbflg" label="Kwitansi Jual Beli" id="kwjbflg"
              v-model="pembiayaanBody.kwjbflg"></v-checkbox>
            <v-checkbox name="fakturc" label="Form A/Vin" id="fakturc" v-model="pembiayaanBody.fakturc"></v-checkbox>

          </v-form>
          <v-container grid-list-md>
            <v-form @submit.prevent="uploadImage">
              <v-row>
                <v-col v-for="(field, index) in dokimg" :key="field.kode" cols="12" sm="6">
                  <v-file-input v-model="field.file"
                    :label="field.flag === 'M' ? `${field.keterangan} (Wajib)` : field.keterangan" accept="image/*"
                    :name="field.kode" prepend-icon="mdi-image" @change="onImageChange(index)" variant="outlined"
                    :rules="field.flag === 'M' && !field.src ? [requiredRule] : []"></v-file-input>
                  <ImageWithDelete v-if="field.src" :imageUrl="field.src" @delete="deleteImage(field.kode, index)" />
                  <!-- <v-img v-if="field.src" :src="field.src" max-height="200" class="my-4"
                    @click="deleteImage(field.kode, index)"></v-img> -->
                </v-col>
                <!-- <v-col v-for="(field, index) in dokimg" :key="field.kode" cols="12" sm="6">
                  <v-file-input v-model="imageList[index].file" :label="imageList[index].keterangan" accept="image/*" :name="imageList[index].kode"
                    prepend-icon="mdi-image" @change="onImageChange2(index)" outlined></v-file-input>
                  <v-img v-if="imageList[index].src" :src="imageList[index].src" max-height="200" class="my-4"></v-img>
                </v-col> -->
              </v-row>

              <v-btn color="primary" type="submit">Upload Foto</v-btn>
            </v-form>
          </v-container>
        </v-card-text>
        <!-- <v-card-actions>
          <v-btn color="secondary" @click="getPembiayaan">Show List</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from 'axios'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import ImageWithDelete from '@/components/ImageWithDelete.vue'

export default {
  name: 'ImageUpload',
  components: {
    ImageWithDelete // untuk penampilan gambar upload, yang dapat di hapus
  },
  setup() {
    const noRegFas = ref(undefined) // nomor dealer
    const noU = ref(undefined) // nomor urut dealer
    const dealerDialog = ref(false)
    const dialogPencairan = ref(false)
    const pencairanBody = ref({})
    const loading = ref(false)
    const dealerList = ref([]) // data dealer
    const dialogListPembiayaan = ref(false) // dialog list pembiayaan
    const dialogPembiayaan = ref(false) // dialog pembiayaan
    const pembiayaanBody = ref({}) // body details pembiayaan
    const listPembiayaan = ref([]) // list pembiayaan API
    const listPembiayaanValues = ref([]) // list pembiayaan yang ditampilkan di data table
    const headers = [
      { text: 'No.', value: 'noregfas' },
      { text: 'Nama', value: 'nama' },
    ]
    const pembiayaanHeaders = [
      { text: 'Kode', value: 'kode' },
      { text: 'No. Polisi', value: 'nopol' },
      { text: 'Dealer', value: 'nmdealer' },
      { text: 'Jenis Produk', value: 'jnsproduk' },
    ]
    const imageFile = ref(null)
    const imageList = ref([]) // uploaded images
    const base64Image = ref(null) // gambar upload format base64
    const previewUrl = ref(null)
    const dokimg = ref([]) // daftar jenis dokumentasi image
    const message = ref('')
    const error = ref('')
    const cabangList = ref([]) // daftar cabang
    const selectedCabang = ref(null) // cabang yang dipilih dari daftar cabang
    const nmDealerSearch = ref(null) // search query untuk list data pembiayaan
    const nopolSearch = ref(null) // search query untuk list data pembiayaan

    // clear dialog
    const closeDialog = (form) => {
      if (form === 'daftar-data') {
        dealerDialog.value = false
        dealerList.value = []
      } else if (form === 'pencairan') {
        dialogPencairan.value = false
        pencairanBody.value = {}
      } else if (form === 'list-pembiayaan') {
        dialogListPembiayaan.value = false
        listPembiayaan.value = []
      } else if (form === 'pembiayaan-dealer') {
        dialogPembiayaan.value = false
        pembiayaanBody.value = {}
      }
    }

    // load data dealer
    const getDealers = async () => {
      dealerDialog.value = true
      loading.value = true

      try {
        // Fetch data dealer
        const response = await axios.post('http://localhost:8080/api/dealer', { query: "" })

        dealerList.value = response.data
      } catch (error) {
        console.error('Gagal fetch data:', error)
        dealerList.value = []
      } finally {
        loading.value = false
      }
    }

    const dealerQuery = ref(null) // query search data dealer

    // get data dealer berdasarkan inputan user
    const dealerSearch = async () => {
      // console.log("Dealer Search: " , dealerQuery.value)
      try {
        // Fetch data dealer
        const response = await axios.post('http://localhost:8080/api/dealer', {
          query: dealerQuery.value
        })
        // const data = await response.json()
        dealerList.value = response.data
      } catch (error) {
        console.error('Gagal fetch data:', error)
        dealerList.value = []
      } finally {
        loading.value = false
      }
    }

    // get data pencairan
    const onRowClickPencairan = async (item) => {
      try {

        // simpan noregfas yang dipilih
        noRegFas.value = item.noregfas
        // console.log("NoRegFas: ", noRegFas.value)

        const response = await axios.post('http://localhost:8080/api/pencairan', {
          noregfas: item.noregfas,
        })

        // TODO: notifikasi user jika tidak ada data pencairan

        if (response.data.length <= 0) {
          dealerDialog.value = false
          Swal.fire({
            icon: 'error',
            title: 'No Data!',
            text: 'Tidak ada data untuk record ini.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Tutup',
            customClass: {
              popup: 'swal-top-z'
            }
          }).then(() => {
            dealerDialog.value = true
          })
        } else {
          const result = response.data[0]; // TODO: pencairan dapat lebih dari satu, integrasi

          // simpan data pencairan di pencairanBody
          pencairanBody.value = {
            nodealer: result.NODEALER,
            nou: result.NOU,
            outstanding: result.OUTSTANDING,
            nmdealer: result.NMDEALER,
            nmdebitur: result.NMDEBITUR,
            marketing: result.MARKETING,
            jthtempomou: result.JTHTEMPOMOU,
            plafond: result.PLAFOND,
            plfsisa: result.PLFSISA,
          }

          // console.log("Pencairan Body: ", pencairanBody.value)

          if (response.data) {
            dialogPencairan.value = true
          }
        }
        // this.message = result.message || 'Upload berhasil!';
      } catch (err) {
        console.error('Gagal fetch data:', err)
      } finally {
        loading.value = false;
      }
    }

    const onRowClickPembiayaan = async (item) => {
      // ambil data gambar
      // dokimg menentukan field gambar yang dapat diisi oleh user
      await getDokumentasiImage()

      const images = await getImages(item.nodealer, item.nou)

      // input gambar ke preview image (kalau ada)
      images.forEach(img => {
        dokimg.value.forEach(item => {
          if (item.kode === img.kode) {
            item.src = img.image
          }
        })
      })

      dialogPembiayaan.value = true
      pembiayaanBody.value = { ...item }
      // nomor dealer dan nomor urut pencairan
      pencairanBody.value = {
        nodealer: item.nodealer,
        nou: item.nou
      }
      // console.log("Pembiayaan Body: ", pembiayaanBody.value)
    }

    // get data pembiayaan
    const getPembiayaan = async () => {
      try {
        loading.value = true
        dialogListPembiayaan.value = true
        // fetch data pembiayaan
        const response = await axios.post('http://localhost:8080/api/pembiayaan', {
          noregfas: noRegFas.value,
        })

        // dokimg menentukan field gambar yang dapat diisi oleh user
        await getDokumentasiImage()

        const images = await getImages(noRegFas.value)

        // input gambar ke preview image (kalau ada)
        images.forEach(img => {
          dokimg.value.forEach(item => {
            if (item.kode === img.kode) {
              item.src = img.image
            }
          })
        })

        console.log("Dok Image: ", dokimg.value)

        // simpan daftar data pembiayaan di list
        if (!response.data) throw new Error('Fetch data pembiayaan gagal!');

        // simpan data ke list pembiayaan
        listPembiayaan.value = response.data.map((item) => ({
          'kode': item.KODE,
          "nodealer": item.NODEALER,
          "nmdealer": item.NMDEALER,
          "nmdebitur": item.NMDEBITUR,
          "nou": item.NOU,
          "outstanding": item.OUTSTANDING,
          "jthtempomou": item.JTHTEMPOMOU,
          "plafond": item.PLAFOND,
          "plfsisa": item.PLFSISA,
          "baserate": item.BASERATE,
          "marketing": item.MARKETING.length > 1 ? item.MARKETING[0] : item.MARKETING,
          "tgltrn": item.TGLTRN,
          "jnsproduk": item.JNSPRODUK,
          "jnskend": item.JNSKEND,
          "merkkend": item.MERKKEND,
          "tipekend": item.TIPEKEND,
          "warna": item.WARNA,
          "thnbuat": item.THNBUAT,
          "nopol": item.NOPOL,
          "nobpkb": item.NOBPKB,
          "odometer": item.ODOMETER,
          "konkend": item.KONKEND,
          "bpkbflg": item.BPKBFLG === '0' ? false : true,
          "faktura": item.FAKTURA,
          "fakturc": item.FAKTURC,
          "ktpflg": item.KTPFLG === '0' ? false : true,
          "nikflg": item.NIKFLG === '0' ? false : true,
          "stnkflg": item.STNKFLG === '0' ? false : true,
          "kwitansiflg": item.KWITANSIFLG === '0' ? false : true,
          "nokanosin": item.NOKANOSIN,
          "ketpbd": item.KETPBD,
          "kodeao": item.KODEAO,
          "nlpasar": item.NLPASAR,
          "nominal": item.NOMINAL,
          "persen": item.PERSEN,
          "sphflg": item.SPHFLG === '0' ? false : true,
          "kwjbflg": item.KWJBFLG === '0' ? false : true
        }));

        // // input data listpembiayaan ke list pembiayaan values
        // listPembiayaanValues.value = listPembiayaan.value

        // console.log("List Pembiayaan: ", listPembiayaan.value)

      } catch (error) {
        console.error('Gagal fetch data pembiayaan:', error)
      } finally {
        loading.value = false;
      }
    }

    // get data cabang
    const getCabang = async () => {
      try {
        // get data
        const response = await axios.get('http://localhost:8080/api/cabang')

        if (!response.data) {
          console.log("Error! Data cabang gagal di-fetch")
          return
        }

        cabangList.value = response.data.map((item) => ({
          value: item.Kd_cabang,
          label: item.NamaCabang,
        }))
      } catch (error) {

      }
    }

    // get all data pembiayaan
    const getAllPembiayaan = async () => {
      try {
        listPembiayaan.value = []

        loading.value = true
        dialogListPembiayaan.value = true

        await getCabang()

        // get data kdcab user login
        const user = JSON.parse(localStorage.getItem('user'))

        // fetch data pembiayaan
        const response = await axios.post('http://localhost:8080/api/pembiayaan/all', {
          kdcab: user.kdcab
        })

        // simpan daftar data pembiayaan di list
        if (!response.data) throw new Error('No data found!');

        // simpan data ke list pembiayaan
        const resData = response.data.map((item) => ({
          'kode': item.KODE,
          'kdcab': item.KDCAB,
          "nodealer": item.NODEALER,
          "nmdealer": item.NMDEALER,
          "nmdebitur": item.NMDEBITUR,
          "nou": item.NOU,
          "outstanding": item.OUTSTANDING,
          "jthtempomou": item.JTHTEMPOMOU,
          "plafond": item.PLAFOND,
          "plfsisa": item.PLFSISA,
          "baserate": item.BASERATE,
          "marketing": item.MARKETING.length > 1 ? item.MARKETING[0] : item.MARKETING,
          "tgltrn": item.TGLTRN,
          "jnsproduk": item.JNSPRODUK,
          "jnskend": item.JNSKEND,
          "merkkend": item.MERKKEND,
          "tipekend": item.TIPEKEND,
          "warna": item.WARNA,
          "thnbuat": item.THNBUAT,
          "nopol": item.NOPOL,
          "nobpkb": item.NOBPKB,
          "odometer": item.ODOMETER,
          "konkend": item.KONKEND,
          "bpkbflg": item.BPKBFLG === '0' ? false : true,
          "faktura": item.FAKTURA,
          "fakturc": item.FAKTURC,
          "ktpflg": item.KTPFLG === '0' ? false : true,
          "nikflg": item.NIKFLG === '0' ? false : true,
          "stnkflg": item.STNKFLG === '0' ? false : true,
          "kwitansiflg": item.KWITANSIFLG === '0' ? false : true,
          "nokanosin": item.NOKANOSIN,
          "ketpbd": item.KETPBD,
          "kodeao": item.KODEAO,
          "nlpasar": item.NLPASAR,
          "nominal": item.NOMINAL,
          "persen": item.PERSEN,
          "sphflg": item.SPHFLG === '0' ? false : true,
          "kwjbflg": item.KWJBFLG === '0' ? false : true
        }));

        listPembiayaan.value = resData
        listPembiayaanValues.value = resData

        console.log("List Pembiayaan: ", listPembiayaan.value)

      } catch (error) {
        console.error('Gagal fetch data pembiayaan:', error)
      } finally {
        loading.value = false;
      }
    }

    // get data image
    const getImages = async (noregfas, noupencairan) => {

      // fetch data foto
      const resFoto = await axios.post('http://localhost:8080/api/images', {
        noregfas: noregfas,
        noupencairan: noupencairan,
      })

      // console.log("ResFoto Data: ", resFoto.data)

      return resFoto.data
    }

    // delete gambar
    const deleteImage = async (value, index) => {
      console.log("Delete Gambar Values: ", pencairanBody.value.nodealer, value)
      try {
        const res = await axios.post('http://localhost:8080/api/images/delete', {
          nodealer: pencairanBody.value.nodealer,
          kode: value
        })

        // delete src agar gambar tidak ditampilkan lagi
        dokimg.value[index].src = null

      } catch (error) {
        console.log('Error, delete image failed: ', error)
      }
    }

    // handler perubahan gambar upload pada form penginputan gambar
    const onImageChange = (index) => {
      // data sekarang disimpan di `dokimg`

      // TODO: cari panjang dan tinggi dari image
      dokimg.value[index].height = '200' // cari nanti!
      dokimg.value[index].width = '200' // cari nanti!

      const file = dokimg.value[index].file;
      if (file && file instanceof File) {
        const reader = new FileReader()
        reader.onload = e => {
          // // mencari panjang dan lebar dari gambar
          // const img = new Image()
          // img.onload = () => {
          //   imageList.value[index].width = img.width
          //   imageList.value[index].height = img.height
          // }
          dokimg.value[index].src = e.target.result
          // simpan url gambar
        }
        reader.readAsDataURL(file)
      } else {
        dokimg.value[index].src = null
      }

      console.log("Daftar Image: ", dokimg.value)
    }

    const onImageChange2 = (index) => {
      // data sekarang disimpan di `dokimg`

      // TODO: cari panjang dan tinggi dari image
      dokimg.value[index].height = '200' // cari nanti!
      dokimg.value[index].width = '200' // cari nanti!

      const file = dokimg.value[index].file;
      if (file && file instanceof File) {

        const reader = new FileReader()

        reader.onload = e => {
          // 1 | simpan data gambar pada array imagelist
          imageList.value[index] = {
            src: e.target.result
          }
          // simpan juga di dokimg biar muncul
          dokimg.value[index].src = e.target.result
        }

        reader.readAsDataURL(file)
      } else {
        imageList.value[index] = null
      }

      console.log("Daftar Image: ", imageList.value)
    }

    // API update data pembiayaan
    async function updatePembiayaan() {
      try {
        const response = await axios.post("http://localhost:8080/api/pembiayaan/updatevalue: ",
          {
            tgltrn: pembiayaanBody.value.tgltrn,
            jnsproduk: pembiayaanBody.value.jnsproduk,
            jnskend: pembiayaanBody.value.jnskend,
            merkkend: pembiayaanBody.value.merkkend,
            thnbuat: pembiayaanBody.value.thnbuat,
            warna: pembiayaanBody.value.warna,
            tipekend: pembiayaanBody.value.tipekend,
            nopol: pembiayaanBody.value.nopol,
            nobpkb: pembiayaanBody.value.nobpkb,
            odometer: pembiayaanBody.value.odometer,
            konkend: pembiayaanBody.value.konkend,
            nlpasar: pembiayaanBody.value.nlpasar,
            nominal: pembiayaanBody.value.nominal,
            persen: pembiayaanBody.value.persen,
            bpkbflg: pembiayaanBody.value.bpkbflg,
            faktura: pembiayaanBody.value.faktura,
            ktpflg: pembiayaanBody.value.ktpflg,
            nikflg: pembiayaanBody.value.nikflg,
            stnkflg: pembiayaanBody.value.stnkflg,
            kwitansiflg: pembiayaanBody.value.kwitansiflg,
            nokanosin: pembiayaanBody.value.nokanosin,
            sphflg: pembiayaanBody.value.sphflg,
            kwjbflg: pembiayaanBody.value.kwjbflg,
            fakturc: pembiayaanBody.value.fakturc,
          }
        );
      } catch (error) {
        console.error(error);
        alert("Gagal mengupdate data data pembiayaan");
      }
    }

    // API upload image
    async function uploadImage() {
      const formData = new FormData();

      // append data gambar dan header-header yang berkaitan (height, width, kode)
      // 1 | filter field-field gambar yang mengalami perubahan
      const imgList = dokimg.value.filter((x) => x.file)

      console.log("Daftar Gambar utk Upload: ", imgList)

      // 2 | append metadata gambar
      imgList.forEach(field => {
        // formData.append('kode', field.kode) // kode
        formData.append(`${field.kode}`, field.file) // file gambar
        formData.append(`src-${field.kode}`, field.src) // file gambar SEJATI (Base64)
        formData.append(`height-${field.kode}`, field.height) // tinggi
        formData.append(`width-${field.kode}`, field.width) // lebar
      });

      // 3 | append data headers
      formData.append('nodealer', pencairanBody.value.nodealer) // nomor dealer
      formData.append('noupencairan', pencairanBody.value.nou) // nomor urut pencairan
      formData.append('nourut', pembiayaanBody.value.nou) // nomor urut gambar
      formData.append('flag', '1') // TODO: isi flag
      formData.append('kode', pembiayaanBody.value.kode) // kode pembiayaan

      // 4 | request http
      try {
        const response = await axios.post("http://localhost:8080/api/uploadbulk", formData, {
          "Content-Type": "multipart/form-data",
        });
        // const result = await response.json();
        alert(response.data.message);
      } catch (err) {
        console.error(err);
        alert("Gagal mengupload gambar");
      }
    }

    async function uploadImage2() {
      const formData = new FormData();

      // append data gambar dan header-header yang berkaitan (height, width, kode)
      const imgList = dokimg.value.filter((x) => x.file)

      console.log("Daftar Gambar: ", imgList)

      imgList.forEach(field => {
        // formData.append('kode', field.kode) // kode
        formData.append(`${field.kode}`, field.file) // file gambar
        formData.append(`height-${field.kode}`, field.height) // tinggi
        formData.append(`width-${field.kode}`, field.width) // lebar
      });

      // headers
      formData.append('nodealer', pencairanBody.value.nodealer) // nomor dealer
      formData.append('noupencairan', pencairanBody.value.nou)
      formData.append('nourut', pembiayaanBody.value.nou)
      formData.append('flag', '1') // TODO: isi flag
      formData.append('kode', pembiayaanBody.value.kode) // kode pembiayaan

      console.log("Form Data: ", formData)

      // wrap JSON
      const payload = {
        images: images, // Array data gambar
        nodealer: nodealer,
        noupencairan: noupencairan,
        flag: flag
      }

      try {
        const response = await axios.post("http://localhost:8080/api/uploadbulk2", JSON.stringify(payload), {
          'Content-Type': 'application/json',
        });
        // const result = await response.json();
        alert(response.data.message);
      } catch (err) {
        console.error(err);
        alert("Gagal mengupload gambar");
      }
    }

    // API daftar dokumentasi image
    async function getDokumentasiImage() {

      try {
        // Fetch data dealer
        const response = await axios.post('http://localhost:8080/api/dokimg', {
          tipe: 'P', // data P: pencairan
        })

        dokimg.value = response.data
        console.log("Daftar Dok. Img: ", dokimg.value)

      } catch (error) {
        console.error('Gagal fetch data:', error)
        dokimg.value = []
      } finally {
        loading.value = false
      }
    }

    // TODO: mengubah data pembiayaan berdasarkan search query
    function onPembiayaanParameterChange() {
      // buat array of filter berdasarkan nilai yang ada
      const filters = []

      // filter daftar cabang
      if (selectedCabang.value) {
        filters.push(item => item.kdcab === selectedCabang.value)
      }

      // filter nama dealer
      if (nmDealerSearch.value) {
        filters.push(item => item.nmdealer.toLowerCase().includes(nmDealerSearch.value.toLowerCase()))
      }

      // filter nomor polisi
      if (nopolSearch.value) {
        filters.push(item => item.nopol.toLowerCase().includes(nopolSearch.value.toLowerCase()))
      }

      // filter data pembiayaan
      listPembiayaanValues.value = listPembiayaan.value.filter(user => filters.every(fn => fn(user)))
      // console.log("Filtered Values: ", filteredPembiayaan)
    }

    const requiredRule = v => !!v || 'Field ini wajib diisi!'

    return {
      noRegFas,
      noU,
      dealerDialog,
      dialogPencairan,
      pencairanBody,
      loading,
      dealerList,
      dialogListPembiayaan,
      dialogPembiayaan,
      pembiayaanBody,
      listPembiayaan,
      listPembiayaanValues,
      headers,
      pembiayaanHeaders,
      imageFile,
      imageList,
      base64Image,
      previewUrl,
      dokimg,
      cabangList,
      selectedCabang,
      nmDealerSearch,
      nopolSearch,
      getDealers,
      dealerQuery,
      dealerSearch,
      onRowClickPencairan,
      onRowClickPembiayaan,
      getAllPembiayaan,
      getPembiayaan,
      getImages,
      deleteImage,
      closeDialog,
      onImageChange,
      onImageChange2,
      updatePembiayaan,
      uploadImage,
      getDokumentasiImage,
      onPembiayaanParameterChange,
      requiredRule
    }
  },
}
</script>

<style>
.swal-top-z {
  z-index: 9999 !important;
}
</style>