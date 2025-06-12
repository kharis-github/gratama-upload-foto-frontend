<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-toolbar-title>My App</v-toolbar-title>
    <v-spacer />
    <v-btn text to="/">Home</v-btn>
    <v-btn text to="/about">About</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    }
  },
}
</script>