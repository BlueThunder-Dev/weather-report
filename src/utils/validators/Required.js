import { Validator } from "./Validator";

export class Required extends Validator {
  execute(value) {
    return value !== null && value !== undefined && value.trim() !== "";
  }
}