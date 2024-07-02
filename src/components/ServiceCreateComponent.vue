<template>
  <div>
    <div>
      <label for="@next"> Nombre del servicio </label>
      <input v-model="service.name" />
    </div>
    <div>
      <label for="@next"> Descripcion del servicio </label>
      <input v-model="service.description" />
    </div>
    <div>
      <label for="@next"> Metodo de ejecucion</label>
      <select v-model="service.launchMethod">
        <option v-for="key in Object.keys(launchMethodEnum)" v-bind:key="key">
          {{ key }}
        </option>
      </select>
    </div>
    <div v-for="param in service.params" v-bind:key="param[0]">
      {{ param[0] + " - " + param[1] }}
      <button @click="service.params?.delete(param[0])">
        Borrar parametro
      </button>
    </div>
    <div>
      <label for="@next"> Parametro </label>
      <input v-model="newParam[0]" /> -
      <select v-model="newParam[1]">
        <option v-for="key in Object.keys(typeEnum)" v-bind:key="key">
          {{ key }}
        </option>
      </select>
      <button @click="service.params?.set(newParam[0], newParam[1])">
        Añadir Parametro
      </button>
    </div>
    <div>
      <label for="@next"> Opcional: String de parametros </label>
      <input
        v-model="service.paramString"
        placeholder="-input <param[input]> -output <param[output]>"
      />
    </div>
    <div>
      <label for="@next">Binario</label>
      <input
        type="file"
        @change="onFileChanged($event)"
        accept="image/*"
        capture
      />
    </div>
    <button @click="create()">Crear Servicio</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import Service from "@/models/service";
import TypeEnum from "@/models/typeenum";
import LaunchMethodEnum from "@/models/launchmethodenum";
@Options({
  props: {},
})
export default class ServiceCreateComponent extends Vue {
  service!: Service;
  newParam!: Record<string, TypeEnum>;
  typeEnum = TypeEnum;
  launchMethodEnum = LaunchMethodEnum;
  binary!: File;

  data() {
    return {
      service: new Service(),
      newParam: {},
    };
  }

  onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      this.binary = target.files[0];
    }
  }

  async create() {
    const formData = new FormData();
    formData.append("name", this.service.name);
    formData.append("file", this.binary);
    formData.append("description", this.service.description);
    formData.append("launchMethod", this.service.launchMethod!);
    for (const param of this.service.params!) {
      formData.append("params[" + param[0] + "]", param[1]);
    }

    const res = await fetch("http://localhost:8070/service", {
      method: "POST",
      body: formData,
    });
    const finalRes = await res.json();
    this.service = finalRes;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
