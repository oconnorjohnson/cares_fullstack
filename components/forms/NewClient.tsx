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
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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
    <div className="px-2">
      <Provider>
        <form action={action as never} onSubmit={() => handleSubmit()}>
          {formErrors.map((error) => (
            <p key={error as string}>{error}</p>
          ))}

          {/* Fields for first_name, last_name, contactInfo, caseNumber, age, sex, and race */}
          <div className="py-1" />
          <Field name="first_name">
            {(field) => (
              <Input
                className=""
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                placeholder="First Name*"
              />
            )}
          </Field>
          <div className="py-1" />
          <Field name="last_name">
            {(field) => (
              <Input
                className=""
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                placeholder="Last Name*"
              />
            )}
          </Field>
          <div className="py-1" />
          <Field name="contactInfo">
            {(field) => (
              <Input
                className=""
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                placeholder="Phone or Email"
              />
            )}
          </Field>
          <div className="py-1" />
          <Field name="caseNumber">
            {(field) => (
              <Input
                className=""
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                placeholder="Case Number"
              />
            )}
          </Field>
          <div className="py-1" />
          <Field name="dateOfBirth">
            {(field) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button>
                    {field.state.value
                      ? format(new Date(field.state.value), "PPP")
                      : "Select Date of Birth"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={
                      field.state.value
                        ? new Date(field.state.value)
                        : undefined
                    }
                    onSelect={(date) => {
                      //@ts-expect-error
                      field.setValue(date || null);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </Field>
          <div className="py-1" />
          <Field name="sex">
            {(field) => (
              <Select
                value={field.state.value || ""}
                onValueChange={(value) => field.setValue(value)}
              >
                <SelectTrigger aria-label="Sex">
                  <SelectValue placeholder="Sex*">
                    {field.state.value || ""}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  {/* ... other options */}
                </SelectContent>
              </Select>
            )}
          </Field>
          <div className="py-1" />
          <Field name="race">
            {(field) => (
              <Select
                value={field.state.value || ""}
                onValueChange={(value) => field.setValue(value)}
              >
                <SelectTrigger aria-label="Race">
                  <SelectValue placeholder="Race*">
                    {field.state.value || ""}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Hispanic">Hispanic</SelectItem>
                  <SelectItem value="AAPI">AAPI</SelectItem>
                </SelectContent>
              </Select>
            )}
          </Field>
          <div className="py-1" />
          <Subscribe
            selector={(formState) => [
              formState.canSubmit,
              formState.isSubmitting,
            ]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </Subscribe>
        </form>
      </Provider>
    </div>
  );
}
