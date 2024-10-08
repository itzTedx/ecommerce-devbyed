'use client'
import React, { useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
}) => {
  const { scrollYProgress } = useScroll()

  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === 'number') {
      let direction = current! - scrollYProgress.getPrevious()!

      if (scrollYProgress.get() < 0.05) {
        setVisible(false)
      } else {
        if (direction < 0) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }
    }
  })

  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          'flex max-w-fit fixed bottom-12 top-auto sm:bottom-auto sm:top-3 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-primary/60 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[9999999900] pr-2 pl-8 py-2 items-center justify-center gap-x-9 sm:gap-x-4 backdrop-blur-lg',
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              'relative text-background items-center flex space-x-1 '
            )}
          >
            <span
              className={cn(
                'block sm:hidden',
                pathname === navItem.link
                  ? 'text-background'
                  : 'text-neutral-300'
              )}
            >
              {navItem.icon}
            </span>
            <span className="hidden text-sm sm:block">{navItem.name}</span>
          </Link>
        ))}
        <button className="border sm:ml-3 text-sm font-medium relative border-neutral-200/30 dark:border-white/[0.2] text-background dark:text-white px-5 py-2 rounded-full">
          <span>Enquire Now</span>
          <span className="absolute inset-x-0 w-1/2 h-px mx-auto -bottom-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
