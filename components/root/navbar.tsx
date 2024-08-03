"use client";

import * as React from "react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { ModeToggle } from "@/components/root/mode-toggle";
import { LoadingSpinner } from "@/components/admin/request/approve";
import { cn } from "@/server/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function SignedInNavBar() {
  return (
    <>
      <SignedIn>
        <div className="p-4 flex flex-row justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              height="50"
              width="50"
              alt="logo"
              className=" hidden lg:block rounded-xl"
            />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-md xl:stext-xl">
                  Learn More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          {/* <Icons.logo className="h-6 w-6" /> */}
                          <div className="mb-2 mt-4 text-lg font-medium">
                            CARES
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Holistic support for members of our community
                            struggling to navigate the criminal justice system.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/about" title="About">
                      Learn about our mission and team.
                    </ListItem>
                    <ListItem href="/get-help" title="Get Help">
                      How can CARES help you or your loved ones?
                    </ListItem>
                    <ListItem href="/get-involved" title="Donate">
                      Support your community by supporting us.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex flex-row justify-center items-center">
            {/* <ModeToggle /> */}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="p-4 flex flex-row justify-between">
          <Link href="/">
            <Image src="/logo.png" height="50" width="50" alt="logo" />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-md xl:stext-xl">
                  Learn More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 w-[275px] md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          {/* <Icons.logo className="h-6 w-6" /> */}
                          <div className="mb-2 mt-4 text-lg font-medium">
                            CARES
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Holistic support for members of our community
                            struggling to navigate the criminal justice system.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/about" title="About">
                      Learn about our mission and team.
                    </ListItem>
                    <ListItem href="/get-help" title="Get Help">
                      How can CARES help you or your loved ones?
                    </ListItem>
                    <ListItem href="/get-involved" title="Donate">
                      Support your community by supporting us.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="hidden lg:block">
                <SignUpButton mode="modal" afterSignUpUrl="/dashboard">
                  <Button variant="ghost" className="text-xl">
                    Sign Up
                  </Button>
                </SignUpButton>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex flex-row justify-center items-center">
            {/* <ModeToggle /> */}
            <div className="px-2" />

            <SignInButton mode="modal" afterSignInUrl="/dashboard">
              <Button>Sign In</Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { href?: string; title: string }
>(({ className, title, children, href, ...props }, ref) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault(); // Prevent default anchor behavior
    if (href) {
      // Check if href is defined
      startTransition(() => {
        router.push(href); // Now we're sure href is a string
      });
    }
  };

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          href={href ?? "#"} // Use href if defined, otherwise fallback to '#' to ensure it's always a string
          onClick={handleClick}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
          {isPending && <LoadingSpinner className="w-4 h-4" />}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
