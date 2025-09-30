<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="info" @click="logout">Logout</v-btn>
      </v-col>
    </v-row>
    <v-container grid-list-md justify="center">
      <v-card elevation="4" outlined shaped max-width="50rem" class="mx-auto" style="margin-top: 10%;">
        <v-card-title primary-title>
          <b>Gratama Upload Foto Desktop</b>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <!-- Pembiayaan Dealer -->
            <v-row>
              <v-col>
                <MenuButton icon="mdi-note-edit" buttonText="Pembiayaan Dealer" :onClick="async () => {
                  dialogListPembiayaan = true
                  await getAllPembiayaan() // get semua data pembiayaan 
                }" size="100" color="secondary" />
              </v-col>
              <v-col>
                <MenuButton icon="mdi-check-circle-outline" buttonText="Perpanjangan RO"
                  :onClick="openDialogPerpanjanganRO" size="100" color="warning" />
              </v-col>
            </v-row>
          </v-container>

          <!-- Perpanjangan RO -->
        </v-card-text>
      </v-card>
    </v-container>

    <!-- <v-text-field label="Pilih Dealer..." @click="getDealers" readonly></v-text-field> -->

    <!-- PILIH PEMBIAYAAN -->
    <v-dialog v-model="dialogPilihPembiayaan" persistent :overlay="false" max-width="800px"
      transition="dialog-transition">
      <v-card>
        <v-card-title primary-title>
          Pilih Pembiayaan
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="() => { dialogPilihPembiayaan = false }"></v-btn>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field label="Pilih Pembiayaan..." @click="getAllPembiayaan" readonly></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card-title>
      </v-card>
    </v-dialog>

    <!-- INPUT DEALER -->
    <v-dialog v-model="dealerDialog" max-width="800px">
      <v-card>
        <v-card-title>
          Daftar Dealer
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="closeDialog('daftar-data')"></v-btn>
        </v-card-title>

        <v-card-text>
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
        <v-card-title class="d-flex justify-end pa-2">
          List Pencairan
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog('list-pembiayaan')" class="ma-0" style="color: red;">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-sm>
            <v-row justify="center">
              <v-col cols="12">
                <v-autocomplete :items="cabangList" item-title="label" item-value="value" v-model="selectedCabang"
                  label="Daftar Cabang" @update:model-value="onCabangChange()"></v-autocomplete>
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
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- PENCAIRAN DETAILS DIALOG -->
    <v-dialog v-model="dialogPencairan" scrollable persistent :overlay="false" max-width="1000"
      transition="dialog-transition">
      <v-card>
        <v-card-title primary-title>
          Detail Dealer
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="closeDialog('pencairan')"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field name="nodealer" label="No. Dealer" id="nodealer" v-model="pencairanBody.nodealer"
              readonly></v-text-field>
            <v-text-field name="outstanding" label="Outstanding" id="outstanding" v-model="pencairanBody.outstanding"
              readonly></v-text-field>
            <v-text-field name="nmdealer" label="Nama Dealer" id="nmdealer" v-model="pencairanBody.nmdealer"
              readonly></v-text-field>
            <v-text-field name="nmdebitur" label="Nama Pemilik" id="nmdebitur" v-model="pencairanBody.nmdebitur"
              readonly></v-text-field>
            <v-text-field name="marketing" label="marketing" id="marketing" v-model="pencairanBody.marketing"
              readonly></v-text-field>
            <v-text-field name="jthtempomou" label="Jatuh Tempo MOU" id="jthtempomou"
              v-model="pencairanBody.jthtempomou" readonly></v-text-field>
            <v-text-field name="plafond" label="Plafond" id="planfond" v-model="pencairanBody.plafond"
              readonly></v-text-field>
            <v-text-field name="plfsisa" label="Plafond Sisa" id="plfsisa" v-model="pencairanBody.plfsisa"
              readonly></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="getPembiayaan">Show List</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- PEMBIAYAAN DETAILS DIALOG -->
    <v-dialog v-model="dialogPembiayaan" scrollable persistent :overlay="false" max-width="1000"
      transition="dialog-transition">
      <v-card>
        <v-card-title primary-title class="d-flex justify-end pa-2">
          Detail Unit
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog('pembiayaan-dealer')" class="ma-0" style="color: red;">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="updatePembiayaan">
            <v-row>
              <v-col>
                <v-text-field name="tgltrn" label="Tanggal Pencairan" id="tgltrn" v-model="pembiayaanBody.tgltrn"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="jnsproduk" label="Jenis Produk" id="jnsproduk" v-model="pembiayaanBody.jnsproduk"
                  readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field name="jnskend" label="Jenis Kendaraan" id="jnskend" v-model="pembiayaanBody.jnskend"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="merkkend" label="Merk" id="merkkend" v-model="pembiayaanBody.merkkend"
                  readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field name="thnbuat" label="Tahun Buat" id="thnbuat" v-model="pembiayaanBody.thnbuat"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="warna" label="Warna" id="warna" v-model="pembiayaanBody.warna"
                  readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field name="tipekend" label="Tipe" id="tipekend" v-model="pembiayaanBody.tipekend"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="nopol" label="No. Polisi" id="nopol" v-model="pembiayaanBody.nopol"
                  readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field name="nobpkb" label="No. BPKB" id="nobpkb" v-model="pembiayaanBody.nobpkb"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="odometer" label="Odometer" id="odometer" v-model="pembiayaanBody.odometer"
                  readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field name="konkend" label="Kondisi Kendaraan" id="konkend" v-model="pembiayaanBody.konkend"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="nlpasar" label="Nilai Pasar" id="nlpasar" v-model="pembiayaanBody.nlpasar"
                  readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field name="nominal" label="Nilai Pokok" id="nominal" v-model="pembiayaanBody.nominal"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="persen" label="Persen Pokok" id="persen" v-model="pembiayaanBody.persen"
                  readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox name="bpkbflg" label="BPKB Asli" id="bpkbflg" v-model="pembiayaanBody.bpkbflg"
                  readonly></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox name="faktura" label="Faktur Asli" id="faktura" v-model="pembiayaanBody.faktura"
                  readonly></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox name="ktpflg" label="KTP (BPKB)" id="ktpflg" v-model="pembiayaanBody.ktpflg"
                  readonly></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox name="nikflg" label="NIK Asli" id="nikflg" v-model="pembiayaanBody.nikflg"
                  readonly></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox name="stnkflg" label="STNK Copy" id="stnkflg" v-model="pembiayaanBody.stnkflg"
                  readonly></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox name="kwitansiflg" label="Kwitansi Kosong Bermaterai" id="kwitansiflg"
                  v-model="pembiayaanBody.kwitansiflg" readonly></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox name="nokanosin" label="Esek-Esek Noka Nosin" id="nokanosin"
                  v-model="pembiayaanBody.nokanosin" readonly></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox name="sphflg" label="Surat Pelepasan Hak" id="sphflg" v-model="pembiayaanBody.sphflg"
                  readonly></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox name="kwjbflg" label="Kwitansi Jual Beli" id="kwjbflg" v-model="pembiayaanBody.kwjbflg"
                  readonly></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox name="fakturc" label="Form A/Vin" id="fakturc" v-model="pembiayaanBody.fakturc"
                  readonly></v-checkbox>
              </v-col>
            </v-row>

          </v-form>
          <v-container grid-list-md>
            <v-form @submit.prevent="uploadImage('1', ['detail-unit', 'pencairan'])">
              <v-row>
                <v-col v-for="(field, index) in dokimg" :key="field.kode" cols="12" sm="6">
                  <v-file-input v-model="field.file" accept="image/*" :name="field.kode" prepend-icon="mdi-image"
                    @change="onImageChange(index)" variant="outlined"
                    :rules="field.flag === 'M' && !field.src ? [requiredRule] : []">
                    <template v-slot:label>
                      <span :class="(field.flag === 'M' && !field.src) ? `text-red` : ``">{{ field.flag === 'M' ? `*
                        ${field.keterangan}` : field.keterangan
                      }}</span>
                    </template>
                  </v-file-input>
                  <ImageWithDelete v-if="field.src" :imageUrl="field.src"
                    @delete="deleteImage(field.kode, index, pencairanBody.nodealer, pencairanBody.nou, null, null, '1', ['pencairan', 'detail-unit'])" />
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

    <!-- MENU PERPANJANGAN RO -->
    <v-dialog v-model="dialogPerpanjanganRO" scrollable persistent :overlay="false" max-width="1000"
      transition="dialog-transition">
      <v-card>
        <v-card-title primary-title class="d-flex justify-end pa-2">
          Perpanjangan RO
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog('perpanjangan-ro')" class="ma-0" style="color: red;">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-sm v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>Loading data...</p>
          </v-container>
          <v-container grid-list-sm>
            <v-form>
              <v-autocomplete :items="cabangList" item-title="label" item-value="value" v-model="selectedCabang"
                label="Daftar Cabang" @update:model-value="onCabangChangePerpanjanganRO()"></v-autocomplete>
              <v-autocomplete :items="dealerList" item-title="nama" item-value="noregfas" v-model="selectedDealer"
                label="Nama Dealer" return-object :disabled="isDealerDisabled" @update:model-value="async (item) => {
                  const { noregfas } = item
                  await getNopols(noregfas) // get data nomor polisi
                  isNopolDisabled = false // activate field nopol
                  selectedNopol = null // hapus pilihan nopol
                  selectedRO = null // kosongkan RO
                }"></v-autocomplete>
              <v-autocomplete :items="nopolList" item-title="nopol" item-value="nopol" v-model="selectedNopol"
                label="No. Polisi" :disabled="isNopolDisabled" return-object @update:model-value="async (item) => {
                  // console.log(item)
                  const { nodealer, nofas } = item
                  await getRO(nodealer, nofas) // get data RO
                  isRODisabled = false // disable RO
                  selectedRO = null // kosongkan RO
                }">
                <!-- <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>
                      {{ item.nofas }} - {{ item.nopol }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template #selection="{ item, index }">
                  <span>{{ item.nofas }} - {{ item.nopol }}</span>
                </template> -->
              </v-autocomplete>
              <v-autocomplete :items="roList" item-title="roke" item-value="roke" v-model="selectedRO" label="RO Ke"
                :disabled="isRODisabled" @update:model-value="() => { return }"></v-autocomplete>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="async () => {
            await getOdometer(selectedDealer.noregfas, selectedNopol.nofas, selectedRO) // simpan data berkaitan odometer
            await getPerpanjanganROImages() // get data gambar perpanjangan RO
            dialogOdometer = true // buka dialog details odometer
          }">Check</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ODOMETER DETAILS -->
    <v-dialog v-model="dialogOdometer" scrollable persistent :overlay="false" max-width="1000"
      transition="dialog-transition">
      <v-card>
        <v-card-title primary-title class="d-flex justify-end pa-2">
          Odometer Details
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog('odometer-details')" class="ma-0" style="color: red;">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col>
                <v-text-field name="nodealer" label="No. Dealer" id="nodealer" v-model="odometerBody.nodealer"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="namadealer" label="Nama Dealer" id="namadealer" v-model="odometerBody.nmdealer"
                  readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field name="nopol" label="No. Polisi" id="nopol" v-model="odometerBody.nopol"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="odolama" label="Odometer RO Sebelum" id="odolama" v-model="odometerBody.odolama"
                  readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field name="odometer" label="Odometer RO Sekarang" id="odometer" v-model="odometerBody.odometer"
                  readonly></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-container grid-list-sm>
            <v-form @submit.prevent="uploadImage('2', ['perpanjangan-ro', 'odometer'])">
              <v-row>
                <v-col v-for="(field, index) in dokimg" :key="field.kode" cols="12" sm="6">
                  <v-file-input v-model="field.file" accept="image/*" :name="field.kode" prepend-icon="mdi-image"
                    @change="onImageChange(index)" variant="outlined"
                    :rules="field.flag === 'M' && !field.src ? [requiredRule] : []">
                    <template v-slot:label>
                      <span :class="(field.flag === 'M' && !field.src) ? `text-red` : ``">{{ field.flag === 'M' ? `*
                        ${field.keterangan}` : field.keterangan
                      }}</span>
                    </template>
                  </v-file-input>
                  <ImageWithDelete v-if="field.src" :imageUrl="field.src"
                    @delete="deleteImage(field.kode, index, null, null, selectedNopol.nofas, selectedRO, '2', ['perpanjangan-ro', 'odometer'])" />
                </v-col>
              </v-row>
              <v-btn color="primary" type="submit">Upload Foto</v-btn>
            </v-form>
          </v-container>
        </v-card-text>
        <!-- <v-card-actions>
          <v-btn color="secondary" @click="getPerpanjanganROImages">Next</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>

    <!-- DIALOG UPLOAD FOTO UNTUK PERPANJANGAN RO -->
    <v-dialog v-model="dialogUploadPerpanjanganRO" scrollable persistent :overlay="false" max-width="1000"
      transition="dialog-transition">
      <v-card>
        <v-card-title primary-title>
          Perpanjangan RO
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="Close" @click="closeDialog('upload-perpanjangan-ro')"></v-btn>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-form @submit.prevent="uploadImage('2')">
              <v-row>
                <v-col v-for="(field, index) in dokimg" :key="field.kode" cols="12" sm="6">
                  <v-file-input v-model="field.file" accept="image/*" :name="field.kode" prepend-icon="mdi-image"
                    @change="onImageChange(index)" variant="outlined"
                    :rules="field.flag === 'M' && !field.src ? [requiredRule] : []">
                    <template>
                      <span class="text-red">{{ field.flag === 'M' ? `* ${field.keterangan}` : field.keterangan
                      }}</span>
                    </template>
                  </v-file-input>
                  <ImageWithDelete v-if="field.src" :imageUrl="field.src"
                    @delete="deleteImage(field.kode, index, null, null, selectedNopol.nofas, selectedRO, '2')" />
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
import MenuButton from '@/components/MenuButton.vue'
import router from '@/router'
import { logout } from '@/helpers/helpers'

const urlString = 'http://localhost:8080'

// const user = JSON.parse(localStorage.getItem('user')) // deklarasi data user login

export default {
  name: 'ImageUpload',
  components: {
    MenuButton, // tombol pada menu
    ImageWithDelete, // untuk penampilan gambar upload, yang dapat di hapus,
  },
  setup() {
    const noRegFas = ref(undefined) // nomor dealer
    const noU = ref(undefined) // nomor urut dealer
    const dealerDialog = ref(false)
    const dialogPencairan = ref(false)
    const pencairanBody = ref({})
    const loading = ref(false)
    const dealerList = ref([]) // data dealer
    const nopolList = ref([]) // data nomor polisi
    const roList = ref([]) // daftar RO
    const odometerBody = ref(null) // odometer
    const selectedDealer = ref(null) // dealer yang dipilih untuk perpanjangan RO
    const selectedNopol = ref(null) // nomor polisi yang dipilih untuk perpanjangan RO
    const selectedRO = ref(null) // RO yg dipilih untuk perpanjangan RO
    const dialogListPembiayaan = ref(false) // dialog list pembiayaan
    const dialogPembiayaan = ref(false) // dialog pembiayaan
    const dialogPilihPembiayaan = ref(false) // dialog pilih pembiayaan
    const dialogPerpanjanganRO = ref(false) // dialog pilih perpanjangan RO
    const dialogOdometer = ref(false) // dialog details odometer
    const dialogUploadPerpanjanganRO = ref(false) // dialog untuk mengupload foto untuk perpanjangan RO
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
    const isDealerDisabled = ref(true) // disable dealer sampai data dealer selesai loading
    const isNopolDisabled = ref(true) // disable nopol kecuali user sudah memilih data dealer
    const isRODisabled = ref(true) // disable RO kecuali user sudah memilih data RO

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
      } else if (form === 'perpanjangan-ro') {
        dialogPerpanjanganRO.value = false // hapus dialog
        selectedNopol.value = null // hilangkan pilihan nopol
      } else if (form === 'odometer-details') {
        dialogOdometer.value = false // hapus dialog odometer details
      } else if (form === 'upload-perpanjangan-ro') {
        dialogUploadPerpanjanganRO.value = false // tutup dialog upload image utk perpanjangan ro
      }
    }

    // fetch data dealer
    const getDealers = async (nama = null, kdcab = null) => {
      // dealerDialog.value = true
      loading.value = true

      try {
        // jika user memilih cabang, kirim selected cabang. Jika tidak, maka tidak usah
        var kdcab = null
        if (!selectedCabang.value) {
          kdcab = user.kdcab
        }
        // fetch data dealer
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/dealer`, {
          nama,
          kdcab,
        })

        dealerList.value = response.data
      } catch (error) {
        console.error('Gagal fetch data:', error)
        dealerList.value = []
      } finally {
        loading.value = false
      }
    }

    // fetch data nomor polisi
    const getNopols = async (noregfas = null) => {
      try {
        // Fetch data dealer
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/nopol`, {
          noregfas,
        })

        nopolList.value = response.data
      } catch (error) {
        console.error('Gagal fetch data nopol:', error)
        nopolList.value = []
      } finally {
        loading.value = false
      }
    }

    // ambil data RO
    const getRO = async (noregfas = null, nofas = null, angsurke = null) => {
      try {
        // Fetch data dealer
        // console.log("Noregfas: ", noregfas)
        // console.log("Nofas: ", nofas)
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/ro`, {
          noregfas,
          nofas,
          angsurke,
        })

        roList.value = response.data
      } catch (error) {
        console.error('Gagal fetch data RO:', error)
        roList.value = []
      } finally {
        loading.value = false
      }
    }

    // fetch data odometer
    const getOdometer = async (nodealer = null, nofas = null, roke = null) => {
      // console.log(nodealer)
      // console.log(nofas)
      // console.log(roke)

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/odometer`, {
          nodealer, // dealer
          nofas,
          roke, // angsuran
        })

        odometerBody.value = response.data[0]

        console.log("Response Data: ", response.data[0])

      } catch (error) {
        console.error('Gagal fetch data odometer:', error)
        odometerBody.value = null
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
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/dealer`, {
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

        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/pencairan`, {
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
      await getDokumentasiImage('P')

      await getImages(item.nodealer, item.nou, null, null, '1')

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
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/pembiayaan`, {
          noregfas: noRegFas.value,
        })

        // dokimg menentukan field gambar yang dapat diisi oleh user
        await getDokumentasiImage('P')

        await getImages(noRegFas.value) // ambil daftar gambar

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

        const user = JSON.parse(localStorage.getItem('user'))

        console.log("User Id: ", user.userid)
        // data cabang hanya berdasarkan cabang-cabang sekategori dengan work area user login
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/cabang`, {
          userid: user.userid
        })

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
    const getAllPembiayaan = async (value = null) => {
      try {
        await getCabang() // get data cabang

        listPembiayaan.value = [] // kosongkan list pembiayaan

        loading.value = true

        dialogListPembiayaan.value = true

        const user = JSON.parse(localStorage.getItem('user'))

        // ubah selected cabang ke kdcabang hanya jika sebelumnya belum ada
        if (!selectedCabang.value) {
          selectedCabang.value = user.kdcab
        }

        var kdcab = selectedCabang.value

        // fetch data pembiayaan
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/pembiayaan/all`, {
          kdcab: kdcab
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
    const getImages = async (noregfas = null, noupencairan = null, nofas = null, roke = null, type = '1') => {

      // fetch data foto
      const resFoto = await axios.post(`${import.meta.env.VITE_API_BASE}/api/images`, {
        noregfas,
        noupencairan,
        nofas,
        roke,
        type,
      })

      // DEBUG: json response
      console.log("Data Foto", resFoto)

      // simpan data image di state dokimg, agar dapat di-preview
      resFoto.data.forEach(img => {
        dokimg.value.forEach(item => {
          if (item.kode === img.kode) {
            item.src = img.image
          }
        })
      })

      return resFoto.data
    }

    // delete gambar
    const deleteImage = async (kode, index, nodealer = null, noupencairan = null, nofas = null, roke = null, type = '1', dialogList = []) => {
      // 1 | pastikan user benar2 ingin mendelete gambar
      toggleDialog(dialogList)
      Swal.fire({
        title: 'Hapus Gambar?',
        text: "Gambar yang dihapus tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // 2 | jalankan proses mendelete gambar jika user memang memilih untuk mendelete gambar
          try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/images/delete`, {
              nodealer,
              noupencairan,
              nofas,
              roke,
              kode,
              type
            })

            if (res.status === 200 || res.status === '200') {
              Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Gambar telah berhasil dihapus.',
                timer: 2000,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
              }).then((result) => {
                toggleDialog(dialogList)
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat menghapus data.',
                confirmButtonText: 'OK',
              }).then((result) => {
                toggleDialog(dialogList)
              })
            }

            // delete src agar gambar tidak ditampilkan lagi
            dokimg.value[index].src = null

          } catch (error) {
            console.log('Error, delete image failed: ', error)
          }
        } else {
          toggleDialog(dialogList)
        }
      })
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
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/pembiayaan/updatevalue: `,
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
    async function uploadImage(type, dialogList = []) {
      // hilangkan dialog
      toggleDialog(dialogList)

      const formData = new FormData();
      // type menentukan jenis flow upload image antara pembiayaan atau perpanjangan RO

      // append data gambar dan header-header yang berkaitan (height, width, kode)

      // 1 | filter field-field gambar yang mengalami perubahan
      const imgList = dokimg.value.filter((x) => x.file)

      // 2 | cegah user untuk mengupload image jika ada field wajib yang belum terisi
      var validation = false
      dokimg.value.forEach((element, index) => {
        if (!element.src && element.flag === 'M') {
          validation = true
        }
      });
      if (validation) {
        Swal.fire({
          icon: 'error',
          title: 'Form Wajib Belum Lengkap!',
          text: 'Semua foto wajib harus di upload terlebih dahulu.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Tutup',
          customClass: {
            popup: 'swal-top-z'
          }
        }).then(() => {
          toggleDialog(dialogList)
        })
        return
      }

      // 3 | append metadata gambar
      imgList.forEach(field => {
        // formData.append('kode', field.kode) // kode
        formData.append(`${field.kode}`, field.file) // file gambar BLOB
        formData.append(`src-${field.kode}`, field.src) // file gambar base64
        formData.append(`height-${field.kode}`, field.height) // tinggi
        formData.append(`width-${field.kode}`, field.width) // lebar
      });

      // 4 | append data headers
      if (type === '1') {
        formData.append('nodealer', pencairanBody.value.nodealer) // nomor dealer
        formData.append('noupencairan', pencairanBody.value.nou) // nomor urut pencairan
      } else {
        formData.append('nofas', selectedNopol.value.nofas) // nofas
        formData.append('roke', selectedRO.value) // roke
      }
      formData.append('nourut', pembiayaanBody.value.nou) // nomor urut gambar
      formData.append('flag', '1') // TODO: isi flag
      formData.append('kode', pembiayaanBody.value.kode) // kode pembiayaan
      formData.append('type', type) // tipe

      // 5 | request http
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/uploadbulk`, formData, {
          "Content-Type": "multipart/form-data",
        });

        // tentukan response berdasarkan response HTTP
        if ([201, '201'].includes(response.status)) {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Foto-foto berhasil di-upload.',
            timer: 2000,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          }).then((result) => {
            toggleDialog(dialogList)
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Upload Foto Gagal!',
            text: 'Ada masalah dalam penguploadan foto.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Tutup',
          }).then(() => {
            toggleDialog(dialogList)
          })
        }

        // // const result = await response.json();
        // alert(response.data.message);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Tutup',
        }).then(() => {
          toggleDialog(dialogList)
        })

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
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/uploadbulk2`, JSON.stringify(payload), {
          'Content-Type': 'application/json',
        });
        // const result = await response.json();
        alert(response.data.message);
      } catch (err) {
        console.error(err);
        alert("Gagal mengupload gambar");
      }
    }

    async function getPerpanjanganROImages() {
      await getDokumentasiImage('R') // ambil daftar dokumentasi image bertipe 'R'
      const images = await getImages(null, null, selectedNopol.value.nofas, selectedRO.value, '2')

      console.log("images: ", images)

      // input gambar ke preview image (kalau ada)
      images.forEach(img => {
        dokimg.value.forEach(item => {
          if (item.kode === img.kode) {
            item.src = img.image
          }
        })
      })
    }

    // API daftar dokumentasi image
    async function getDokumentasiImage(tipe = 'P') {

      try {
        // Fetch data dealer
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/dokimg`, {
          tipe,
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

    async function onCabangChange() {
      await getAllPembiayaan()
    }

    async function onCabangChangePerpanjanganRO() {
      await getDealers(null) // ubah data dealers

    }

    async function openDialogPerpanjanganRO() {
      await getCabang() // get data cabang

      dialogPerpanjanganRO.value = true
      loading.value = true
      isDealerDisabled.value = true

      const user = JSON.parse(localStorage.getItem('user'))

      // get data dealer
      await getDealers(null)

      isDealerDisabled.value = false
      loading.value = false

    }

    const requiredRule = v => !!v || 'Field ini wajib diisi!'

    const toggleDialog = function (fields = []) {
      if (fields.length <= 0) {
        return
      } else {
        fields.forEach((row) => {
          if (row === 'pencairan') {
            dialogListPembiayaan.value = !dialogListPembiayaan.value // list pencairan
          } else if (row === 'detail-unit') {
            dialogPembiayaan.value = !dialogPembiayaan.value // detail unit
          } else if (row === 'perpanjangan-ro') {
            dialogPerpanjanganRO.value = !dialogPerpanjanganRO.value // hapus dialog perpanjangan ro
          } else if (row === 'odometer') {
            dialogOdometer.value = !dialogOdometer.value // odometer details
          }
        })
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
      nopolList,
      roList,
      odometerBody,
      selectedDealer,
      selectedNopol,
      selectedRO,
      dialogListPembiayaan,
      dialogPembiayaan,
      dialogPilihPembiayaan,
      dialogPerpanjanganRO,
      dialogUploadPerpanjanganRO,
      dialogOdometer,
      openDialogPerpanjanganRO,
      logout,
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
      isDealerDisabled,
      isNopolDisabled,
      isRODisabled,
      getDealers,
      getNopols,
      getRO,
      getOdometer,
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
      getPerpanjanganROImages,
      getDokumentasiImage,
      onPembiayaanParameterChange,
      onCabangChange,
      onCabangChangePerpanjanganRO,
      requiredRule,
      toggleDialog
    }
  },
}
</script>

<style>
.swal-top-z {
  z-index: 9999 !important;
}

.text-red {
  color: red;
}
</style>