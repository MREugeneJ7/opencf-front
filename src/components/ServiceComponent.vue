<template>
  <div>
    <h2>{{ service.name }}</h2>
    <p>{{ service.description }}</p>
    <div
      v-for="param in Object.entries(service.params as object)"
      v-bind:key="param[0]"
    >
      <label for="@next">{{ param[0] }}</label>
      <input
        v-if="param[1] != 'RESOURCE'"
        v-bind:type="calculateType(param[1])"
        :value="paramsToSend?.get('params[' + param[0] + ']')"
        @input="
          paramsToSend?.set(
            'params[' + param[0] + ']',
            ($event!.target as HTMLTextAreaElement)!.value
          )
        "
      />
      <select
        v-else
        :value="paramsToSend?.get('params[' + param[0] + ']')"
        @input="
          paramsToSend?.set(
            'params[' + param[0] + ']',
            ($event!.target as HTMLTextAreaElement)!.value
          )
        "
      >
        <option
          v-for="resource in resources.filter((r) => !r.isOutput)"
          v-bind:key="resource.id"
          :value="resource.id"
        >
          {{ resource.name }}
        </option>
      </select>
    </div>
    <button @click="execute()">excute</button>
    <button @click="showUploadResourceModal = true">upload resource</button>

    <div v-if="executionResponse.exitCode != undefined">
      <h2>Resultados de la ejecucion</h2>
      <p>Exit Code: {{ executionResponse.exitCode }}</p>
      <p>Logs de error: {{ executionResponse.errors }}</p>
      <p>Logs de ejecución normal: {{ executionResponse.output }}</p>
      <h3>Output de recursos</h3>
      <ul>
        <li
          v-for="resource in executionResponse.outputs"
          v-bind:key="resource.id"
          @click="download(resource)"
        >
          {{ resource.name }}
        </li>
      </ul>
    </div>

    <Teleport to="body">
      <!-- use the modal component, pass in the prop -->
      <ModalComponent
        :show="showUploadResourceModal"
        @close="showUploadResourceModal = false"
      >
        <template #header>
          <h3>Subir nuevo Resource</h3>
        </template>
        <template #body>
          <div>
            <div>
              <label for="@next"> Nombre del recurso</label>
              <input v-model="resource.name" />
            </div>
            <div>
              <label for="@next"> Descripcion del recurso </label>
              <input v-model="resource.description" />
            </div>
            <div>
              <label for="@next">Recurso</label>
              <input
                type="file"
                @change="onFileChanged($event)"
                accept="image/*"
                capture
              />
            </div>
          </div>
        </template>
        <template #footer>
          <button @click="upload()">Subir Recurso</button>
          <button @click="showUploadResourceModal = false">Close</button>
        </template>
      </ModalComponent>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import Service from "@/models/service";
import TypeEnum from "@/models/typeenum";
import Resource from "@/models/resource";
import ExecutionResponse from "@/models/executionResponse";
import ModalComponent from "@/components/ModalComponent.vue";
@Options({
  props: {
    id: String,
  },
  components: {
    ModalComponent,
  },
})
export default class ServiceComponent extends Vue {
  id!: string;
  service!: Service;
  paramsToSend!: Map<string, string>;
  resources!: Resource[];
  resource: Resource = new Resource();
  showUploadResourceModal = false;
  resourceFile!: File;
  executionResponse!: ExecutionResponse;

  data() {
    return {
      service: new Service(),
      paramsToSend: new Map<string, string>(),
      showUploadResourceModal: false,
      executionResponse: new ExecutionResponse(),
      resources: new Array<Resource>(),
    };
  }
  async mounted() {
    await this.getService(this.id);
    for (let [key] of Object.entries(this.service.params as object)) {
      this.paramsToSend?.set("params[" + key + "]", "");
    }
    await this.getResources(this.id);
  }

  async getService(id: string) {
    const res = await fetch("http://localhost:8070/service/" + id, {
      //headers: {
      //  Authorization: "Bearer " + this.getToken(),
      //},
    });
    const finalRes = await res.json();
    this.service = finalRes;
  }

  calculateType(type: unknown): string {
    switch (type) {
      case TypeEnum.INT:
        return "int";
    }
    return "";
  }

  async execute() {
    const res = await fetch(
      "http://localhost:8070/service/execute/" + this.id,
      {
        method: "POST",
        body: new URLSearchParams(Object.fromEntries(this.paramsToSend)),
      }
    );
    const finalRes = await res.json();
    this.executionResponse = finalRes;
  }

  async getResources(id: string) {
    const res = await fetch("http://localhost:8070/resource?serviceId=" + id, {
      //headers: {
      //  Authorization: "Bearer " + this.getToken(),
      //},
    });
    const finalRes = await res.json();
    this.resources = finalRes;
  }

  onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      this.resourceFile = target.files[0];
    }
  }

  async upload() {
    const formData = new FormData();
    formData.append("name", this.resource.name);
    formData.append("file", this.resourceFile);
    formData.append("description", this.resource.description);
    formData.append("service", this.service.id);

    const res = await fetch("http://localhost:8070/resource", {
      method: "POST",
      body: formData,
    });
    const finalRes = await res.json();
    this.resources.push(finalRes);
  }

  async download(resource: Resource) {
    const res = await fetch("http://localhost:8070/resource/" + resource.id, {
      //headers: {
      //  Authorization: "Bearer " + this.getToken(),
      //},
    });
    const finalRes = await res.blob();
    var url = window.URL.createObjectURL(finalRes);
    var a = document.createElement("a");
    a.href = url;
    a.download = resource.name;
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();
    a.remove();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
