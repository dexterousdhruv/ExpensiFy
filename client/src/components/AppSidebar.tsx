import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Banknote, LayoutDashboard, Wallet } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const items = [
  {
    title: "Dashboard",
    url: "",
    icon: LayoutDashboard
  },
  {
    title: "Budgets",
    url: "budgets",
    icon: Wallet
  },
  {
    title: "Expenses",
    url: "expenses",
    icon: Banknote
  }  
]


export function AppSidebar() {
  const { open } = useSidebar()
  const { pathname } = useLocation()

  const tab = pathname.split("/")[2] || ""

  return (
    <Sidebar collapsible="icon" variant="floating" >
      <SidebarHeader>
        <div className="flex justify-center mt-2 items-center gap-2 mb-4">
          {open ? (
            <img src={'/logo.svg'} className="w-40" alt="" />
            
          ): (
            <img src={'/icon.svg'} width={40} height={40} alt="'" className="translate-x-0.5"  />
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              {items?.map((item)  => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}
                        className={cn(
                          {'!bg-zinc-800 !text-white' :  tab === item.url  }, "mb-1"
                        )}
                      >
                          <item.icon />
                          <span className="text-sm md:text-[15px] font-inter ml-1 ">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
