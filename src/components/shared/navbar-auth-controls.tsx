'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'

export function NavbarAuthControls() {
  const { user, logout } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-[#0c3d3a] text-sm font-semibold text-white">{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Account menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 border-slate-200 bg-white p-2 shadow-lg">
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border border-slate-200">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-[#0c3d3a] font-semibold text-white">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer rounded-xl bg-[#0c3d3a] px-3 py-3 text-center text-sm font-semibold text-white focus:bg-[#0a2f2c] focus:text-white"
        >
          <LogOut className="mr-2 inline h-4 w-4 align-text-bottom" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
