"use client";

import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { useEffect, useState, Fragment } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { AddressValidator, TAddressValidator } from "@/lib/validators/account-credentials-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";

const Page = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<TAddressValidator>({
    resolver: zodResolver(AddressValidator),
  });

  const { items, removeItem, clearCart } = useCart();
  const router = useRouter();

  const { mutate: createCheckoutSession } = trpc.payment.createSession.useMutation({
    onSuccess: ({ url }) => {
      
      router.push("/orders");
    },
  });

  const CITY = "Springfield";
  const STATE = "Illinois";

  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const FRETE = 0;
  const cartTotal = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  const { data: isLogged } = trpc.auth.isLogged.useQuery();
  const [showLoginDialog, setShowLoginDialog] = useState<boolean>(isLogged === false);

  const { profile_finished } = trpc.auth.getUserinfo.useQuery().data || {};

  const handleCheckout = (data: TAddressValidator) => {
    if (!isLogged) {
      setShowLoginDialog(true);
      return;
    }

    if (isLogged && profile_finished === false) {
      router.push("/update-profile");
      return;
    }

    const transformedItems = items.map(item => ({
      product: item.product.id,
      quantity: item.quantity,
      notes: item.notes,
    }));
    createCheckoutSession({ cartItems: transformedItems, address: data });
    clearCart();
  };

  return (
    <div className="bg-white dark:bg-[#121212]">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className={cn("lg:col-span-7", { "rounded-lg border-2 border-dashed border-zinc-200 p-12": items.length === 0 })}>
            <h2 className="sr-only">Items in the cart</h2>

            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div aria-hidden="true" className="relative mb-4 h-40 w-40 text-muted-foreground">
                  <Image src="/e-cart.png" alt="empty cart" fill loading="eager" className="mx-auto" />
                </div>
                <h3 className="font-semibold text-2xl lg:text-4xl">Your cart is empty!</h3>
                <p className="text-muted-foreground text-center lg:text-xl">Explore the store and add products to your cart.</p>
              </div>
            ) : null}

            <ul className={cn({ "divide-y divide-gray-200 border-b border-t border-gray-200": isMounted && items.length > 0 })}>
              {isMounted && items.map((cur_item, index) => {
                const { product, quantity, notes } = cur_item;
                const category = typeof product.category === "string" ? product.category : product.category?.name || "Uncategorized";
                const { image } = product;

                return (
                  <li key={index} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24">
                        {typeof image !== "string" && image.url ? (
                          <Image src={image.url} alt={product.name} fill className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48" />
                        ) : null}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-lg lg:text-2xl">
                              <p className="font-medium text-gray-700 dark:text-white">{product.name}</p>
                            </h3>
                          </div>
                          <div className="mt-1 text-sm flex">
                            <p className="text-muted-foreground lg:text-lg">{category}</p>
                          </div>
                          <p className="mt-1 text-sm lg:text-lg">Quantity: {quantity}</p>
                          <p className="mt-1 text-sm font-medium text-blue-600 lg:text-lg">{formatPrice(product.price * quantity)}</p>
                          <p className="mt-1 text-sm text-slate-500 lg:text-lg">{notes || ""}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                          <div className="absolute right-0 top-0">
                            <Button aria-label="remove product" onClick={() => removeItem(cur_item.id)} variant="ghost">
                              <X className="h-5 w-5 lg:h-7 lg:w-7" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
                })}
              </ul>
              </div>

              <div className="mt-16 lg:mt-0 lg:col-span-5 space-y-8">
              <form onSubmit={handleSubmit(handleCheckout)} className="">
                <section className="rounded-lg bg-gray-50 dark:bg-[#252323] px-4 py-6 sm:p-6 lg:p-8">
                <h2 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-white">Delivery Address</h2>
                <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                  <Label htmlFor="state" className="text-base font-bold">State</Label>
                  <Input id="state" type="text" value={STATE} readOnly required {...register("state")} />
                  </div>
                  <div>
                  <Label htmlFor="city" className="text-base font-bold">City</Label>
                  <Input id="city" type="text" value={CITY} readOnly required {...register("city")} />
                  </div>
                  <div className="sm:col-span-2">
                  <Label htmlFor="street" className="text-base font-bold">Street</Label>
                  <Input id="street" type="text" {...register("street", { required: true })} />
                  {errors.street && <p className="text-red-600">This field is required.</p>}
                  </div>
                  <div className="sm:col-span-2">
                  <Label htmlFor="zip" className="text-base font-bold">ZIP Code</Label>
                  <Input id="zip" type="text" {...register("zip", { required: true })} />
                  {errors.zip && <p className="text-red-600">This field is required.</p>}
                  </div>
                  <div>
                  <Label htmlFor="number" className="text-base font-bold">Number</Label>
                  <Input id="number" type="text" {...register("number", { required: true })} />
                  {errors.number && <p className="text-red-600">This field is required.</p>}
                  </div>
                  <div>
                  <Label htmlFor="complement" className="text-base font-bold">Complement</Label>
                  <Input id="complement" type="text" {...register("complement")} />
                  </div>
                </div>
                </section>

                <section className="rounded-lg bg-gray-50 dark:bg-[#252323] px-4 py-6 sm:p-6 lg:p-8 mt-10">
                <h2 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-white">Order Summary</h2>
                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                  <dt className="text-sm lg:text-lg font-medium text-gray-700 dark:text-white">Subtotal</dt>
                  <dd className="text-sm lg:text-lg font-medium text-gray-900 dark:text-white">{formatPrice(cartTotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                  <dt className="text-sm lg:text-lg font-medium text-gray-700 dark:text-white">Shipping</dt>
                  <dd className="text-sm lg:text-lg font-medium text-gray-900 dark:text-white">{formatPrice(FRETE)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base lg:text-xl font-bold text-gray-900 dark:text-white">Total</dt>
                  <dd className="text-base lg:text-xl font-bold text-gray-900 dark:text-white">{formatPrice(cartTotal + FRETE)}</dd>
                  </div>
                </dl>
                </section>

                <Button type="submit" className="w-full mt-8">Complete Order</Button>
              </form>
              </div>
            </div>
            </div>

            {/* Dialog */}
      <Transition appear show={showLoginDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setShowLoginDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-md lg:max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Button
                    aria-label="Close"
                    className="absolute top-4 right-4 p-2 bg-slate-400"
                    onClick={() => setShowLoginDialog(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <Dialog.Title as="h3" className="text-lg lg:text-xl font-medium leading-6 text-gray-900 text-center">
                    Log in or Create an Account
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="lg:text-md text-sm text-gray-500 text-center">
                      You need to be logged in to complete the purchase. Please log in or create an account. Your data will be saved for when you return.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-center gap-5">
                    <Button onClick={() => router.push('/sign-in')} className="mr-2">Log In</Button>
                    <Button variant="secondary" onClick={() => router.push('/sign-up')}>Create Account</Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Page;
