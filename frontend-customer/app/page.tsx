"use client";

import Link from "next/link";
import { Scissors, Calendar, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Scissors className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                StyleCut Salon
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/book" className="transition-colors hover:text-foreground/80 text-foreground/60">Services</Link>
              <Link href="/book" className="transition-colors hover:text-foreground/80 text-foreground/60">Stylists</Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/book">
              <Button>Book Now</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Elevate Your Style
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Experience premium hair care services from top professionals.
              Modern styles, classic cuts, and everything in between.
            </p>
            <div className="space-x-4">
              <Link href="/book">
                <Button size="lg" className="rounded-full">Book Appointment</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="rounded-full">Client Login</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Services Preview */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24 bg-secondary/20 rounded-xl">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Our Services
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              We offer a wide range of services tailored to your needs.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {[
              { title: "Haircut", icon: Scissors, desc: "Precision cuts for men and women." },
              { title: "Styling", icon: User, desc: "Blowouts, updos, and event styling." },
              { title: "Booking", icon: Calendar, desc: "Easy online scheduling 24/7." }
            ].map((item, i) => (
              <div key={i} className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <item.icon className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; 2024 StyleCut Salon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
