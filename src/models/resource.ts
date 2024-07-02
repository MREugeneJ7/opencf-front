import TypeEnum from "./typeenum";

class Resource {
  id!: string;
  name!: string;
  description!: string;
  file!: string;
  service!: string;
  isOutput!: boolean;
}

export default Resource;
