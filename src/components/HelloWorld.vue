<template>
  <div
    v-for="service in services"
    v-bind:key="service.id"
    style="background-color: gray; margin: 2%"
  >
    <RouterLink :to="'/service/' + service.id">
      <h2>{{ service.name }}</h2>
      <p>{{ service.description }}</p>
    </RouterLink>
  </div>
  <RouterLink :to="'/create'"> Crear Servicio </RouterLink>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import Service from "@/models/service";
export default class HelloWorld extends Vue {
  msg!: string;
  services!: Array<Service>;

  data() {
    return {
      services: [],
    };
  }
  mounted() {
    this.getServices();
  }

  async getServices() {
    const res = await fetch("http://localhost:8070/service", {
      //headers: {
      //  Authorization: "Bearer " + this.getToken(),
      //},
    });
    const finalRes = await res.json();
    this.services = finalRes;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
