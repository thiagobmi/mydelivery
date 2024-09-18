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
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "../../../../public/logoSVG";

import { useTheme } from "@/context/themecontext";
import { Suspense, useEffect, useState } from "react";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      console.log("Login successful!");
      toast.success("Login successful!");
      localStorage.setItem("authReload", "true");
      setIsAuthenticated(true);
    },
    onError: (error) => {
      console.error("Login error:", error);
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Wrong email or password!");
      }
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    signIn({ email, password });
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }

    const authReload = localStorage.getItem("authReload");
    if (authReload) {
      localStorage.removeItem("authReload");
      router.push(origin);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(origin);
    }
  }, [isAuthenticated, router]);

  const { data: isLogged } = trpc.auth.isLogged.useQuery();

  if (isLogged) {
    return (
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Logo width={300} height={70} theme={theme} />
            <h1 className="text-2xl font-bold lg:text-5xl">You are already logged in!</h1>
            <Link href="/">
              <Button className="mt-5 lg:py-4 lg:px-6">Go back to the homepage</Button>
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
            <h1 className="text-4xl font-bold lg:text-5xl">Sign In</h1>
            <Link href="/sign-up" className={buttonVariants({ variant: "link", className: "lg:text-[18px]" })}>
              Don't have an account yet? <p className="text-red-600 m-1"> Sign up</p> <ArrowRight className="h-4 w-4" />
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
                    <p className="text-red-500 text-sm text-center mb-1 lg:text-lg">{errors.email.message}</p>
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
                    <p className="text-red-500 text-sm text-center mb-1 lg:text-lg">{errors.password.message}</p>
                  )}
                </div>
                <Button disabled={isLoading} className="lg:py-4 lg:px-6 lg:mt-4 lg:text-lg">Sign In</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
}
