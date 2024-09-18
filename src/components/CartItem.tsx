import { CartItem } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils";
import { ImageIcon,X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";

export const ShowCartItem = (item: CartItem) => {
    const { product, quantity, notes } = item;
    const { image } = product;
    const {removeItem} = useCart();

    return (
      <div className='space-y-10 py-2'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center space-x-4'>
            <div className='relative aspect-square h-16 w-16 lg:h-24 lg:w-24 min-w-fit overflow-hidden rounded'>
              {typeof image !== 'string' && image.url ? (
                <img
                  src={image.url}
                  alt={product.name}
                  className='absolute object-cover w-max h-max'
                />
              ) : (
                <div className='flex h-full items-center justify-center bg-secondary'>
                  <ImageIcon
                    aria-hidden='true'
                    className='h-4 w-4 text-muted-foreground'
                  />
                </div>
              )}
            </div>

            <div className='flex flex-col self-start'>
              <span className='line-clamp-1 text-base font-medium mb-1 lg:text-xl'>
                {product.name}
              </span>

              <span className='line-clamp-1 text-sm capitalize text-muted-foreground lg:text-base'>
                {notes ? notes : ''}
              </span>

              <div className='mt-2 text-s text-muted-foreground'>
                <button
                  onClick={() => removeItem(item.id)}
                  className='flex items-center gap-0.5'>
                  <X className='w-3 h-4' />
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className='flex flex-col space-y-1 font-medium items-end'>
            <span className='text-base lg:text-xl mr-3'>{quantity}</span>
          
            <span className='ml-auto line-clamp-1 lg:text-lg mr-3'>
              {formatPrice(product.price * quantity)}
            </span>
          </div>
        </div>
      </div>
    )
    }
    
export default ShowCartItem;