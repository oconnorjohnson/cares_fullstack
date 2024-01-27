// first_name  String
// last_name   String
// contactInfo String?
// caseNumber  String?
// age         Int
// sex         String
// race        String
// userId      Int
// user        User      @relation(fields: [userId], references: [id])
// requests    Request[]

// @@index([userId, clientId])

// sex && race will be selected from dropdown
// userId, user, and requests are irrelevant to front-end form

"use client";
import { FormApi, mergeForm, useTransform } from "@tanstack/react-form";
import { newClientFactory } from "@/lib/form-factories";
import { newClient } from "@/lib/actions";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

const ClientComp = () => {
  const [state, action] = useFormState(
    newClient,
    newClientFactory.initialFormState,
  );

  const { useStore, Provider, Subscribe, handleSubmit, Field } =
    newClientFactory.useForm({
      transform: useTransform(
        (baseForm: FormApi<any, any>) => mergeForm(baseForm, state),
        [state],
      ),
    });

  const formErrors = useStore((formState) => formState.errors);

  return <></>;
};
