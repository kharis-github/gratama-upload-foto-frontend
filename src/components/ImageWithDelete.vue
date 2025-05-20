<template>
    <div class="image-wrapper" style="margin-left: 70px; width: 70%;" @mouseenter="hover = true" @mouseleave="hover = false">
        <v-img :src="imageUrl" aspect-ratio="1" class="rounded" cover></v-img>
        <v-btn v-if="hover" icon size="x-small" color="red" class="delete-btn" @click="deleteImage">
            <v-icon size="small">mdi-close</v-icon>
        </v-btn>
    </div>
</template>

<script>
export default {
    props: {
        imageUrl: String,
    },
    data() {
        return {
            hover: false,
        };
    },
    methods: {
        // fungsi untuk mendelete foto
        deleteImage() {
            this.$emit('delete'); // meng-emit event bernama `delete`
        },
    },
};
</script>

<style scoped>
.image-wrapper {
    position: relative;
    display: inline-block;
    width: 150px;
    height: 150px;
}

.delete-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1;
}
</style>
