'use client'

import { User } from '@/payload-types'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

const UserAccountNav = ({ user }: { user: User }) => {
  const { signOut } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='overflow-visible'>
        <Button
          variant='ghost'
          size='sm'
          className='relative dark:text-white text-black text-lg'>
          My Account
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='bg-white'
        align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            <Link href='/profile' className='font-medium text-sm text-black'>
              {user.email}
            </Link>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            <Link href='/orders' className='font-medium text-sm text-black'>
              My Orders
            </Link>
          </div>
        </div>
        <DropdownMenuSeparator />


        <DropdownMenuItem
          onClick={signOut}
          className='cursor-pointer text-black'>
          Sign Out
        </DropdownMenuItem>


      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav