import { z } from "zod"

export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
  confirmPassword: z.string().optional(),

})

export const UserProfileValidator = z.object({
  name: z.string()
    .min(1, "Name cannot be empty")
    .refine((name) => name.includes(" ") && !name.endsWith(" "), {
      message: "Incomplete name.",
    }),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Phone must have 11 digits"),
    
});

export const SignUpValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }), 
  confirmPassword: z.string(),
  
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const AddressValidator = z.object({
  state: z.string().min(2, "Invalid state"),
  city: z.string().min(2, "Invalid city"),
  zip: z.string().min(8, "Invalid ZIP code"),
  street: z.string().min(2, "Invalid street"),
  number: z.string().min(1, "Invalid number"),
  complement: z.string().optional(),
});

export type TUserProfileValidator = z.infer<typeof UserProfileValidator>;

export type TAddressValidator = z.infer<typeof AddressValidator>;

export type TSignUpValidator = z.infer<
  typeof SignUpValidator
>

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>
