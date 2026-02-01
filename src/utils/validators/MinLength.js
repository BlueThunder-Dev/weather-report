import { Validator } from "./Validator";

export class MinLength extends Validator {
  constructor(minLength, message) {
    super(message);
    this.minLength = minLength;
  }
  execute(value) {
    return value.length >= this.minLength;
  }
}