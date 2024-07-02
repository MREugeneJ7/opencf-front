<template>
  <ServiceComponent :id="getId()" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ServiceComponent from "@/components/ServiceComponent.vue"; // @ is an alias to /src
@Options({
  components: {
    ServiceComponent,
  },
})
export default class ServiceView extends Vue {
  getId(): string {
    return String(this.$route.params.id);
  }
}
</script>
