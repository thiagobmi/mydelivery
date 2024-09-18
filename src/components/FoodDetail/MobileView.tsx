import React, { useContext, useState } from "react";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { assets } from "../../assets/assets";
import { Product, ProductImage } from "@/payload-types";
import { useCart } from "@/hooks/use-cart";
import AddToCartButton from "../AddToCartButton";

interface DesktopViewProps {
  isOpen: boolean;
  onClose: () => void;
  food: Product;
}

const DesktopView: React.FC<DesktopViewProps> = ({ isOpen, onClose, food }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const { items, addItem } = useCart();
  const itemCount = items.length;
  const cartTotal = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  let imageUrl = "";
  if (typeof food.image === "string") {
    imageUrl = food.image;
  } else if (food.image && "url" in food.image) {
    imageUrl = (food.image as ProductImage).url || "";
  }

  if (!food) {
    return <div>Loading...</div>;
  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-3xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 w-full max-w-6xl shadow-black max-h-[90vh] overflow-y-auto mt-10">
                <div className="bg-white shadow-4xl rounded-2xl shadow-slate-950 flex flex-col md:flex-row h-full dark:bg-[#131213]">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-200 absolute top-4 right-4"
                  >
                    <XMarkIcon className="h-7 w-7" aria-hidden="true" />
                  </button>

                  <h1 className="mt-8 text-2xl font-bold text-center">
                    {food.name}
                  </h1>
                  <div className="md:w-1/2 p-4 flex justify-center items-center">
                    <img
                      src={imageUrl}
                      alt={food.name}
                      className="w-full h-auto rounded object-cover"
                    />
                  </div>

                  <div className="md:w-1/2 p-4 flex flex-col justify-between overflow-y-auto">
                    <div>
                      <div className="flex flex-col mb-2">
                        <p className="text-gray-500 text-l dark:text-gray-300">
                          Price
                        </p>
                        <p className="text-blue-700 text-xl mb-2 font-semibold">
                          $ {food.price}
                        </p>
                        <p className="text-gray-500 text-l dark:text-gray-300">
                          Description
                        </p>
                        <p>{food.description}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xl dark:text-gray-300">
                        Notes
                      </p>
                      <textarea
                        id="notes"
                        className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes..."
                      />
                      <div className="flex items-center justify-between mb-4">
                        <img
                          className="w-10 cursor-pointer"
                          src={assets.remove_icon_red.src}
                          onClick={decrementQuantity}
                          alt="decrement"
                        />
                        <span className="text-2xl mx-4">{quantity}</span>
                        <img
                          className="w-10 cursor-pointer"
                          src={assets.add_icon_green.src}
                          onClick={incrementQuantity}
                          alt="increment"
                        />
                        <span className="ml-4 text-2xl font-semibold">
                          $ {food.price * quantity}
                        </span>
                      </div>
                      <AddToCartButton
                        product={food}
                        quantity={quantity}
                        notes={notes}
                        onClose={onClose}
                      />
                      {/* <button onClick={() => { onClose();addItem(food, quantity, notes); }} className="text-2xl mt-4 bg-blue-700 text-white px-4 py-2 rounded w-full dark:bg-blue-800">Add to Cart</button> */}
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DesktopView;
