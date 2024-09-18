import { ThemeToggle } from '../theme-toggle-button'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { UserProfileMenuClient } from '../auth/UserProfileMenu.client'

type NavBarProps = {
  navItems: {
    to: string
    label: string
    showOnMobile: boolean
    showOnDesktop: boolean
    requiresAuth: boolean
  }[]
}

export function NavBar({ navItems }: NavBarProps) {
  return (
    <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        {navItems
          // .filter(
          //   (item) =>
          //     item.showOnDesktop && (!item.requiresAuth )
          // )
          .map((item, index) => (
            <Link
              key={index}
              href={item.to}
              className={
                false
                  ? 'text-lg font-semibold md:text-base'
                  : 'text-muted-foreground transition-colors hover:text-foreground'
              }
            >
              {item.label}
            </Link>
          ))}
      </nav>
      <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <form className='ml-auto flex-1 sm:flex-initial'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input type='search' placeholder='Search...' className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]' />
          </div>
        </form>
        <ThemeToggle />
        <UserProfileMenuClient />
      </div>
    </header>
  )
}
