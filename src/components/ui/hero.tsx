"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Hero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "container mx-auto flex flex-col items-center justify-center gap-4 p-8 text-center",
      className
    )}
    {...props}
  />
))
Hero.displayName = "Hero"

const HeroTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
    {...props}
  />
))
HeroTitle.displayName = "HeroTitle"

const HeroDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("max-w-[90%] text-lg text-muted-foreground", className)}
    {...props}
  />
))
HeroDescription.displayName = "HeroDescription"

const HeroImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-video rounded-md object-cover shadow-md", className)}
    {...props}
  />
))
HeroImage.displayName = "HeroImage"

export { Hero, HeroTitle, HeroDescription, HeroImage }
