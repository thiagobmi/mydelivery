"use client";

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useCart } from '@/hooks/use-cart'
import { Product } from '@/payload-types'

const AddToCartButton = ({
  product, quantity, notes, onClose
}: {
  product: Product,
  quantity: number,
  notes: string,
  onClose: () => void
}) => {
  const { addItem } = useCart()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isSuccess])

  return (
    <Button
      onClick={() => {
        addItem(product, quantity, notes)
        setIsSuccess(true)
        onClose()
      }}
      size='lg'
      className='w-full'>
      {isSuccess ? 'Added!' : 'Add to Cart'}
    </Button>
  )
}

export default AddToCartButton
