"use server";
import { newClientFactory } from "./form-factories";

export async function newClient(prev: unknown, formData: FormData) {
  return await newClientFactory.validateFormData(formData);
}
