"use client";
import { assets } from "../../../assets/assets";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  SignUpValidator,
  TSignUpValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import Logo from "../../../../public/logoSVG";
import { useTheme } from "@/context/themecontext";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpValidator>({
    resolver: zodResolver(SignUpValidator),
  });

  const { theme } = useTheme();
  const router = useRouter();

  const signInMutation = trpc.auth.signIn.useMutation({
    onError: (error) => {
      toast.error("Error logging in after account creation!");
    },
    onSuccess: () => {
      toast.success("Account created and user logged in successfully!");
      router.push("/profile");
    },
  });

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (error) => {
      if (error.data?.code === "CONFLICT") {
        toast.error("This email is already in use!");
        return;
      }

      if (error instanceof ZodError) {
        toast.error(error.issues[0].message);
        return;
      }

      toast.error("Error creating account, please try again later!");
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/profile"); // TODO: Send verification email
      window.location.reload();
    },
  });

  const onSubmit = ({ email, password, confirmPassword }: TSignUpValidator) => {
    mutate({ email, password, confirmPassword });
  };

  const { data: isLogged } = trpc.auth.isLogged.useQuery();

  if (isLogged) {
    return (
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Logo width={300} height={70} theme={theme} />
            <h1 className="text-2xl font-bold lg:text-5xl">You are already logged in!</h1>
            <Link href="/">
              <Button className="mt-5 lg:py-4 lg:px-6">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-4xl font-bold lg:text-5xl">Sign Up</h1>

            <Link href="/sign-in" className={buttonVariants({ variant: "link", className: "lg:text-lg" })}>
              Already have an account?  <p className="text-red-600 m-1">Sign in</p>  <ArrowRight className="h-4 w-4 lg:h-6 lg:w-6" />{" "}
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email" className="py-1 lg:text-lg">
                    Email
                  </Label>
                  <Input
                    {...register("email")}
                    className={cn("lg:text-lg", { "focus-visible:ring-red-500": errors.email })}
                    placeholder="youremail@example.com"
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-sm text-center mb-1 lg:text-lg">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password" className="py-1 lg:text-lg">
                    Password
                  </Label>
                  <Input
                    {...register("password")}
                    type="password"
                    className={cn("lg:text-lg", { "focus-visible:ring-red-500": errors.password })}
                    placeholder="Password"
                  />
                  {errors?.password && (
                    <p className="text-red-500 text-sm text-center mb-1 lg:text-lg">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="confirmPassword" className="py-1 lg:text-lg">
                    Confirm Password
                  </Label>
                  <Input
                    {...register("confirmPassword")}
                    type="password"
                    className={cn("lg:text-lg", { "focus-visible:ring-red-500": errors.confirmPassword })}
                    placeholder="Confirm Password"
                  />
                  {errors?.confirmPassword && (
                    <p className="text-red-500 text-sm text-center mb-1 lg:text-lg">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button disabled={isLoading} className="lg:py-4 lg:px-6 lg:text-lg lg:mt-3">Create Account</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
