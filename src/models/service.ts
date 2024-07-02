import TypeEnum from "./typeenum";
import LaunchMethodEnum from "./launchmethodenum";

class Service {
  id!: string;
  name!: string;
  description!: string;
  launchMethod?: LaunchMethodEnum;
  params?: Map<string, TypeEnum>;
  paramString?: string;

  constructor() {
    this.params = new Map<string, TypeEnum>();
  }
}

export default Service;
