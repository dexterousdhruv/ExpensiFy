// type Props = {}

import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import useUserInfo from "@/hooks/use-user-info"
import { LogOut } from "lucide-react"
import toast from "react-hot-toast"
import {  Outlet } from "react-router-dom"






const Main = () => {
  const { userInfo, setUserInfo } = useUserInfo()
  
  return (
    <SidebarProvider>
    <div className="">
      <AppSidebar  />
    </div>
    <main className='w-full h-screen p-2'>
      <div className='flex items-center h-16 gap-2 border-sidebar-border bg-sidebar border shadow rounded-sm p-2 px-4 '>
        <SidebarTrigger />
        <div className='ml-auto'></div> 
        {userInfo && (
          <Button
            className="font-inter bg-zinc-800"
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                setUserInfo("")
                toast.success("User logged out!")
              }
            }}
          >
            Log out
            <LogOut/>
          </Button>
        )}
      </div>

      <div className="h-3"></div>
      {/* Main Content */}
      <div className="border-sidebar-border bg-sidebar border w-full shadow-md rounded-sm overflow-y-auto h-[calc(100vh-100px)] py-4 px-3 sm:px-4  lg:p-6">
        <Outlet />
      </div>
    </main>
  </SidebarProvider>
  )
}

export default Main