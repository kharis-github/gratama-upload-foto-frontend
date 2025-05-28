<template>
    <div>
        <v-btn :color="color" class="square-btn" @click="click" :style="buttonStyle">
            <v-icon :size="size * 2 / 3">{{ icon }}</v-icon>
        </v-btn>
        <h3>
            {{ buttonText }}
        </h3>
    </div>
</template>

<script>

export default {
    props: {
        icon: {
            type: String,
            default: 'mdi-image' // default icon
        },
        color: {
            type: String,
            default: 'primary' // default Vuetify color
        },
        size: {
            type: [String, Number],
            default: '56'
        },
        buttonText: {
            type: String,
            default: ''
        }
    },
    methods: {
        click() {
            this.$emit('onClick')
        }
    },
    setup(props) {
        const buttonStyle = {
            width: props.size + 'px',
            height: props.size + 'px',
            minWidth: props.size + 'px',
            minHeight: props.size + 'px',
            padding: '0',
            borderRadius: '8px'
        }

        return {
            buttonStyle, // style button diubah secara dinamis
        }
    }
}
</script>

<style scoped>
.square-btn {
    /* width: 56px;
    height: 56px; */
    border-radius: 8px;
    /* min-width: 0; */
    /* penting agar width tidak diperluas otomatis oleh Vuetify */
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
