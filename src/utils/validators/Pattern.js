import { Validator } from "./Validator";

export class Pattern extends Validator {
  constructor(regex, message) {
    super(message);
    this.regex = regex;
  }
  execute(value) {
    return this.regex.test(value);
  }
}