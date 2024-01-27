import { createFormFactory } from "@tanstack/react-form";

export const newClientFactory = createFormFactory({
  defaultValues: {
    first_name: "",
    last_name: "",
    contactInfo: "",
    caseNumber: "",
    age: 0,
    sex: "",
    race: "",
  },
  onServerValidate({ value }) {
    if (!value.first_name) {
      return "Server validation: First name required.";
    }
    if (!value.last_name) {
      return "Server validation: Last name required.";
    }
    if (value.age < 1) {
      return "Server validation: Age required.";
    }
    if (!value.sex) {
      return "Server validation: Sex required.";
    }
    if (!value.race) {
      return "Server validation: Race required.";
    }
  },
});
