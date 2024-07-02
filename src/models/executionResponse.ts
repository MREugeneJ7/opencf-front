import Resource from "./resource";

class ExecutionResponse {
  exitCode!: number;
  errors!: string;
  output!: string;
  outputs!: Array<Resource>;
}

export default ExecutionResponse;
