export default class InputValidator {
  constructor(name, value, rules, checker = {}) {
    this.name = name;
    this.value = value.trim();
    this.rules = rules;
    this.checker = {
      REQUIRED: {
        validate: () => {
          return this.value.length > 0;
        },
        getResponse: () => {
          return `${this.name} is required`;
        }
      },
      ...checker
    };
  }

  set newValue(value) {
    this.value = value;
  }

  get error() {
    return this.validate(this.rules);
  }

  hasErrors(rule) {
    return !this.checker[rule].validate();
  }

  getResponse(rule) {
    return this.checker[rule].getResponse();
  }

  validate(rules) {
    let response = "";

    rules.forEach(rule => {
      if (this.hasErrors(rule)) {
        response = this.checker[rule].getResponse();
        return;
      }
    });

    return response;
  }
}
