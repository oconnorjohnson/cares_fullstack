import { createFormFactory } from "@tanstack/react-form";

export const newClientFactory = createFormFactory({
  defaultValues: {
    first_name: "",
    last_name: "",
    contactInfo: "",
    caseNumber: "",
    dateOfBirth: null,
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
    if (!value.dateOfBirth) {
      return "Server validation: Date of birth required.";
    }
    if (!value.sex) {
      return "Server validation: Sex required.";
    }
    if (!value.race) {
      return "Server validation: Race required.";
    }
  },
});
