import { createFormFactory } from "@tanstack/react-form";

export const newClientFactory = createFormFactory({
  defaultValues: {
    first_name: "First Name",
    last_name: "Last Name",
    contactInfo: "Phone # or Email Address",
    caseNumber: "Example: CR201954",
    age: 55,
    sex: "Male",
    race: "White",
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
