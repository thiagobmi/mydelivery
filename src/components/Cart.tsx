"use client";

import Image from "next/image";
import { SeparatorHorizontal, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { CartItem, useCart } from '@/hooks/use-cart';
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { ShowCartItem } from "./CartItem";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/context/themecontext";

const Cart = () => {
  const { items } = useCart();
  const shipping: number = 0;
  const itemCount = items.length;
  const cartTotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div>
      <Sheet>
        <SheetTrigger className="group -m-2 flex items-center p-2 mr-2">
          <ShoppingCart
            aria-hidden="true"
            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-white lg:h-8 lg:w-8 "
          />
          <span className="ml-2 text-sm lg:text-lg font-medium text-gray-700 group-hover:text-gray-800 mr-2 dark:text-white">
            {itemCount}
          </span>
        </SheetTrigger>

        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg lg:max-w-4xl dark:bg-[#121212]">
          <SheetHeader className="space-y-2.5 pr-6">
            <SheetTitle className="lg:text-2xl">Cart ({isMounted ? itemCount : 0})</SheetTitle>
          </SheetHeader>

          {itemCount > 0 ? (
            <>
              <div className="flex w-full flex-col pr-6">
                <ScrollArea className="max-h-96 overflow-y-auto">
                  {items.map((item: CartItem, index) => (
                    <ShowCartItem key={index} {...item} />
                  ))}
                </ScrollArea>
              </div>
              <div className="space-y-4 pr-6">
                <Separator />
                <div className="space-y-1.5 pr-6">
                  <div className="flex">
                    <span className="flex-1 lg:text-lg">Shipping</span>
                    <span className="text-green-400 lg:text-lg">Free</span>
                  </div>
                  <div className="flex">
                    <span className="flex-1 text-lg lg:text-2xl">Total</span>
                    <span className="text-lg lg:text-xl">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <SheetFooter className="mt-auto">
                  <SheetTrigger asChild>
                    <Link
                      href="/cart"
                      className={buttonVariants({
                        className: "w-full lg:text-xl hover:text-red-700",
                      })}
                    >
                      Checkout
                    </Link>
                  </SheetTrigger>
                </SheetFooter>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-1">
              <div className="relative mb-52 h-60 w-64 text-muted-foreground text-center">
                
                {theme ==="dark" ? 
                  <Image src="/e-cart.png" alt="empty cart" width={200} height={200} className="mx-auto invert" />
                  :
                  <Image src="/e-cart.png" alt="empty cart" width={200} height={200} className="mx-auto" />
                }
                <span className="font-semibold text-2xl"> Your cart is empty!</span>

                <SheetTrigger asChild>
                  <Link
                    href="/"
                    className={buttonVariants({
                      variant: "link",
                      size: "sm",
                      className: "text-sm text-muted-foreground",
                    })}
                  >
                    Add products to the cart
                  </Link>
                </SheetTrigger>
              </div>
            </div>
          )}

          <div className="absolute bottom-2 right-4"><ThemeToggle /></div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Cart;
