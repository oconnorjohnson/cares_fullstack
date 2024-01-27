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

        <Field
          name="age"
          validators={{
            onChange: ({ value }) =>
              value < 8
                ? "Client validation: You must be at least 8"
                : undefined,
          }}
        >
          {(field) => {
            return (
              <div>
                <input
                  className="text-black"
                  name="age"
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error as string}>{error}</p>
                ))}
              </div>
            );
          }}
        </Field>
        <Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </button>
          )}
        </Subscribe>
      </form>
    </Provider>
  );
}
