<template>
  <ServiceCreateComponent />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ServiceCreateComponent from "@/components/ServiceCreateComponent.vue"; // @ is an alias to /src
@Options({
  components: {
    ServiceCreateComponent,
  },
})
export default class ServiceCreateView extends Vue {}
</script>
