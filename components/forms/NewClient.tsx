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
import { newClientFactory } from "@/server/form-factories";
import { newClient } from "@/server/actions";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function NewClient() {
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

  return (
    <Provider>
      <form action={action as never} onSubmit={() => handleSubmit()}>
        {formErrors.map((error) => (
          <p key={error as string}>{error}</p>
        ))}

        {/* Fields for first_name, last_name, contactInfo, caseNumber, age, sex, and race */}
        <Field name="first_name">
          {(field) => (
            <Input
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
              placeholder="First Name"
            />
          )}
        </Field>
        <Field name="last_name">
          {(field) => (
            <Input
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
              placeholder="Last Name"
            />
          )}
        </Field>
        <Field name="contactInfo">
          {(field) => (
            <Input
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
              placeholder="Contact Info"
            />
          )}
        </Field>
        <Field name="caseNumber">
          {(field) => (
            <Input
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
              placeholder="Case Number"
            />
          )}
        </Field>
        <Field
          name="age"
          validators={{
            onChange: ({ value }) =>
              value < 8
                ? "Client validation: You must be at least 8"
                : undefined,
          }}
        >
          {(field) => (
            <div>
              <Input
                type="number"
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.valueAsNumber)}
                placeholder="Age"
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )}
        </Field>

        <Field name="sex">
          {(field) => (
            <Select value={field.state.value} onValueChange={field.setValue}>
              <SelectTrigger aria-label="Sex">
                <SelectValue>{field.state.value || "Select Sex"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        </Field>
        <Field name="race">
          {(field) => (
            <Select value={field.state.value} onValueChange={field.setValue}>
              <SelectTrigger aria-label="Race">
                <SelectValue>{field.state.value || "Select Race"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {/* Replace with actual race options */}
                <SelectItem value="race1">Race 1</SelectItem>
                <SelectItem value="race2">Race 2</SelectItem>
                <SelectItem value="race3">Race 3</SelectItem>
              </SelectContent>
            </Select>
          )}
        </Field>

        <Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </Subscribe>
      </form>
    </Provider>
  );
}
