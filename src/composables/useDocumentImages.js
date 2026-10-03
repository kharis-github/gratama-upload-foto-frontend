import { ref } from 'vue'
import { imageUploadModel } from '@/models/imageUploadModel'

export function useDocumentImages({ startApiLoading, stopApiLoading, loading }) {
  const dokimg = ref([])

  const getImages = async (noregfas = null, noupencairan = null, nofas = null, roke = null, type = '1') => {
    startApiLoading('Mengambil data gambar...')
    try {
      const response = await imageUploadModel.fetchImages({
        noregfas,
        noupencairan,
        nofas,
        roke,
        type,
      })

      response.data.forEach((image) => {
        const document = dokimg.value.find((item) => item.kode === image.kode)
        if (document) document.src = image.image
      })

      return response.data
    } catch (error) {
      console.error('Gagal fetch data gambar:', error)
      return []
    } finally {
      stopApiLoading()
    }
  }

  const getDokumentasiImage = async (tipe = 'P') => {
    startApiLoading('Mengambil daftar dokumentasi gambar...')
    try {
      const response = await imageUploadModel.fetchDokumentasiImage({
        tipe,
      })

      dokimg.value = response.data
    } catch (error) {
      console.error('Gagal fetch data:', error)
      dokimg.value = []
    } finally {
      loading.value = false
      stopApiLoading()
    }
  }

  const onImageChange = (index) => {
    dokimg.value[index].height = '200'
    dokimg.value[index].width = '200'

    const file = dokimg.value[index].file
    if (file && file instanceof File) {
      const reader = new FileReader()
      reader.onload = (event) => {
        dokimg.value[index].src = event.target.result
      }
      reader.readAsDataURL(file)
    } else {
      dokimg.value[index].src = null
    }
  }

  return {
    dokimg,
    getImages,
    getDokumentasiImage,
    onImageChange,
  }
}