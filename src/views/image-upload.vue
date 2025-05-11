<template>
  <v-container>
    <v-text-field label="Klik untuk Ambil Data" @click="getDealers" readonly></v-text-field>
    <!-- 1 | Field Input Dealer -->
    <v-dialog v-model="dealerDialog" max-width="800px">
      <v-card>
        <v-card-title>
          Daftar Data
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="closeDialog('daftar-data')"></v-btn>
        </v-card-title>

        <v-card-text>
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

    <!-- list pembiayaan -->

    <v-dialog v-model="dialogListPembiayaan" max-width="800px">
      <v-card>
        <v-card-title>
          List Pembiayaan
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="closeDialog('list-pembiayaan')"></v-btn>
        </v-card-title>

        <v-card-text>
          <v-data-table :headers="pembiayaanHeaders" :items="listPembiayaan" :loading="loading"
            loading-text="Mengambil data..." class="elevation-1">
            <template #item="{ item }">
              <tr @click="onRowClickPembiayaan(item)" style="cursor: pointer;">
                <td>{{ item.kode }}</td>
                <td>{{ item.nmdebitur }}</td>
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
          Pencairan Pinjaman
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
          Pembiayaan Dealer Detail Unit
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="closeDialog('pembiayaan-dealer')"></v-btn>
        </v-card-title>

        <v-card-text>
          <v-form>
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

            <v-container grid-list-md>
              <v-form @submit.prevent="uploadImage">
                <v-row>
                  <v-col v-for="(field, index) in dokimg" :key="field.kode" cols="12" sm="6">
                    <v-file-input v-model="field.file" :label="field.keterangan" accept="image/*" :name="field.kode"
                      prepend-icon="mdi-image" @change="() => { onImageChange(index) }" outlined></v-file-input>
                  </v-col>
                </v-row>
                <v-img v-if="previewUrl" :src="previewUrl" max-height="200" class="my-4"></v-img>

                <v-btn color="primary" type="submit">Upload Foto</v-btn>
              </v-form>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="getPembiayaan">Show List</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from 'axios'
import { ref } from 'vue'
import Swal from 'sweetalert2'

export default {
  name: 'ImageUpload',
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
    const listPembiayaan = ref([]) // list pembiayaan untuk pencairan yang sedang dipilih
    const headers = [
      { text: 'No.', value: 'noregfas' },
      { text: 'Nama', value: 'nama' },
    ]
    const pembiayaanHeaders = [
      { text: 'Kode', value: 'kode' },
      { text: 'Debitur', value: 'nmdebitur' },
      { text: 'Jenis Produk', value: 'jnsproduk' },
    ]
    const imageFile = ref(null)
    const imageList = ref([]) // uploaded images
    const base64Image = ref(null) // gambar upload format base64
    const previewUrl = ref(null)
    const dokimg = ref([]) // daftar jenis dokumentasi image
    const message = ref('')
    const error = ref('')

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
        const response = await fetch('http://localhost:8080/api/dealer')
        const data = await response.json()
        // console.log("Dealer Data: ", data)
        dealerList.value = data
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
          Swal.fire({
            icon: 'error',
            title: 'Tidak ada Data Pencairan!',
            text: 'Dealer ini tidak ada data pencairan.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Tutup',
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

    const onRowClickPembiayaan = (item) => {
      dialogPembiayaan.value = true
      pembiayaanBody.value = { ...item }
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
        getDokumentasiImage()

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

        console.log("List Pembiayaan: ", listPembiayaan.value)

      } catch (error) {
        console.error('Gagal fetch data pembiayaan:', err)
      } finally {
        loading.value = false;
      }
    }

    // perubahan gambar
    const onImageChange = (index) => {
      // data sekarang disimpan di `dokimg`

      // TODO: cari panjang dan tinggi dari image
      dokimg.value[index].height = '200' // cari nanti!
      dokimg.value[index].width = '200' // cari nanti!
      console.log("Dokumentasi Image: ", dokimg.value)

      const reader = new FileReader()
      reader.onload = e => {
        // mencari panjang dan lebar dari gambar
        const img = new Image()
        img.onload = () => {
          imageList.value[index].width = img.width
          imageList.value[index].height = img.height
        }
        img.src = e.target.result
      }

      // // 1 | add parameter(s) associated with image
      // imageList.value[index].kode = dokimg.value[index].kode // field kode

      // console.log("Image List: ", imageList.value)

      // TODO: 2 | preview image
      if (imageFile.value) {
        previewUrl.value = URL.createObjectURL(imageFile.value);
      } else {
        previewUrl.value = null;
      }
    }

    // API upload image
    async function uploadImage() {
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

      try {
        const response = await axios.post("http://localhost:8080/api/uploadtesting", formData, {
          "Content-Type": "multipart/form-data",
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
      dealerDialog.value = true
      loading.value = true

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
      headers,
      pembiayaanHeaders,
      imageFile,
      imageList,
      base64Image,
      previewUrl,
      dokimg,
      getDealers,
      onRowClickPencairan,
      onRowClickPembiayaan,
      getPembiayaan,
      closeDialog,
      onImageChange,
      uploadImage,
      getDokumentasiImage
    }
  },
}
</script>