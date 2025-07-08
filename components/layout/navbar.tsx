"use client"
import { Menu } from "lucide-react"
import React from "react"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { Separator } from "../ui/separator"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu"
import { Button } from "../ui/button"
import Link from "next/link"

interface RouteProps {
  href: string
  label: string
}

interface DomainProps {
  title: string
  description: string
}

const routeList: RouteProps[] = [
  {
    href: "#about",
    label: "About Us",
  },
  {
    href: "#team",
    label: "The Team",
  },
  {
    href: "#sessions",
    label: "Upcoming Sessions",
  },
  {
    href: "/admin",
    label: "Admin",
  },
  {
    href: "/blog",
    label: "Blogs",
  },
]

const domainList: DomainProps[] = [
  {
    title: "Web Development",
    description: "Frontend and Backend technologies, frameworks, and tools.",
  },
  {
    title: "Mobile Development",
    description: "iOS and Android app development with modern frameworks.",
  },
  {
    title: "Data Science & AI",
    description:
      "Machine Learning, Data Analysis, and Artificial Intelligence.",
  },
  {
    title: "Competitive Programming",
    description: "Algorithm design, problem solving, and coding competitions.",
  },
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3a3f5f] bg-[#2c2f4a]">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-lg font-bold text-white"
        >
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <span className="text-sm font-bold text-[#2c2f4a]">PC</span>
          </div>
          Club
        </Link>

        {/* Mobile Menu */}
        <div className="flex items-center lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Menu
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer text-white hover:text-gray-300"
              />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex flex-col justify-between border-[#3a3f5f] bg-[#2c2f4a] text-white"
            >
              <div>
                <SheetHeader className="mb-6">
                  <SheetTitle className="flex items-center text-white">
                    <Link href="/" className="flex items-center">
                      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                        <span className="text-sm font-bold text-[#2c2f4a]">
                          PC
                        </span>
                      </div>
                      Club
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base text-white hover:bg-[#3a3f5f] hover:text-[#9d4edd]"
                  >
                    <Link href="#domains">Our Domains</Link>
                  </Button>

                  {routeList.map(({ href, label }) => (
                    <Button
                      key={href}
                      onClick={() => setIsOpen(false)}
                      asChild
                      variant="ghost"
                      className="justify-start text-base text-white hover:bg-[#3a3f5f] hover:text-[#9d4edd]"
                    >
                      <Link href={href}>{label}</Link>
                    </Button>
                  ))}
                </div>
              </div>

              <SheetFooter className="flex-col items-start justify-start sm:flex-col">
                <Separator className="mb-4 bg-[#3a3f5f]" />
                <Button
                  className="w-full bg-[#ff6b6b] font-medium text-white hover:bg-[#ff5252]"
                  onClick={() => setIsOpen(false)}
                >
                  CONTACT
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="mx-auto hidden lg:block">
          <NavigationMenuList>
            {/* Our Domains Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="border-none bg-transparent text-base text-gray-300 hover:text-white">
                Our Domains
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[500px] grid-cols-1 gap-3 bg-white p-4">
                  {domainList.map(({ title, description }) => (
                    <NavigationMenuLink key={title} asChild>
                      <Link
                        href={`#${title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block rounded-md p-3 text-sm transition-colors hover:bg-gray-50"
                      >
                        <p className="mb-1 font-semibold leading-none text-[#2c2f4a]">
                          {title}
                        </p>
                        <p className="line-clamp-2 text-gray-600">
                          {description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Regular Navigation Links */}
            <NavigationMenuItem>
              {routeList.map(({ href, label }) => (
                <NavigationMenuLink key={href} asChild>
                  <Link
                    href={href}
                    className="px-4 py-2 text-base font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              ))}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Contact Button */}
        <div className="hidden lg:flex">
          <Button
            asChild
            className="transform bg-[#ff6b6b] px-6 py-2 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[#ff5252]"
          >
            <Link href="#contact">CONTACT</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
