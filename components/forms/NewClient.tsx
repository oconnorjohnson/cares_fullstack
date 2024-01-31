// "use client";

// import { newClient } from "@/server/actions";

// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { format } from "date-fns";

// export default function NewClient() {
//   return (
//     <form>
//       {/* Fields for first_name, last_name, contactInfo, caseNumber, age, sex, and race */}
//       <Field name="first_name">
//         {(field) => (
//           <Input
//             name={field.name}
//             value={field.state.value}
//             onChange={(e) => field.setValue(e.target.value)}
//             placeholder="First Name"
//           />
//         )}
//       </Field>

//       <Field name="last_name">
//         {(field) => (
//           <Input
//             name={field.name}
//             value={field.state.value}
//             onChange={(e) => field.setValue(e.target.value)}
//             placeholder="Last Name"
//           />
//         )}
//       </Field>

//       <Field name="contactInfo">
//         {(field) => (
//           <Input
//             name={field.name}
//             value={field.state.value}
//             onChange={(e) => field.setValue(e.target.value)}
//             placeholder="Phone or Email"
//           />
//         )}
//       </Field>

//       <Field name="caseNumber">
//         {(field) => (
//           <Input
//             name={field.name}
//             value={field.state.value}
//             onChange={(e) => field.setValue(e.target.value)}
//             placeholder="Case Number"
//           />
//         )}
//       </Field>

//       <Field name="dateOfBirth">
//         {(field) => (
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button>
//                 {field.state.value
//                   ? format(new Date(field.state.value), "PPP")
//                   : "Select Date of Birth"}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent>
//               <Calendar
//                 mode="single"
//                 selected={
//                   field.state.value ? new Date(field.state.value) : undefined
//                 }
//                 onSelect={(date) => field.setValue(Date || null)}
//               />
//             </PopoverContent>
//           </Popover>
//         )}
//       </Field>

//       <Field name="sex">
//         {(field) => (
//           <Select
//             value={field.state.value || ""}
//             onValueChange={(value) => field.setValue(value)}
//           >
//             <SelectTrigger aria-label="Sex">
//               <SelectValue placeholder="Sex">
//                 {field.state.value || ""}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Male">Male</SelectItem>
//               <SelectItem value="Female">Female</SelectItem>
//               <SelectItem value="Other">Other</SelectItem>
//               {/* ... other options */}
//             </SelectContent>
//           </Select>
//         )}
//       </Field>

//       <Field name="race">
//         {(field) => (
// <Select
//   value={field.state.value || ""}
//   onValueChange={(value) => field.setValue(value)}
// >
//   <SelectTrigger aria-label="Race">
//     <SelectValue placeholder="Race">
//       {field.state.value || ""}
//     </SelectValue>
//   </SelectTrigger>
//   <SelectContent>
//     <SelectItem value="African American / Black">
//       African American / Black
//     </SelectItem>
//     <SelectItem value="American Indian / Alaska Native">
//       American Indian / Alaska Native
//     </SelectItem>
//     <SelectItem value="Asian">Asian</SelectItem>
//     <SelectItem value="Hispanic / Latino">
//       Hispanic / Latino
//     </SelectItem>
//     <SelectItem value="Middle Eastern / North African">
//       Middle Eastern / North African
//     </SelectItem>
//     <SelectItem value="Native Hawaiian / Other Pacific Islander">
//       Native Hawaiian / Other Pacific Islander
//     </SelectItem>
//     <SelectItem value="White">White</SelectItem>
//     <SelectItem value="Other">Other</SelectItem>
//   </SelectContent>
// </Select>
//         )}
//       </Field>

//       <Button type="submit" disabled={!canSubmit || isSubmitting}>
//         {isSubmitting ? "Submitting..." : "Submit"}
//       </Button>
//     </form>
//   );
// }
