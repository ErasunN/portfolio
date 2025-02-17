'use client'
import TextLoop from '@/components/ui/TextLoop'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800 px-0 py-4 dark:border-zinc-100">
      <div className="flex items-center justify-between">
        <a href="https://github.com/nerasun/portfolio" target="_blank">
          <TextLoop
            texts={["Nerasun", "Full-stack Developer"]}
            interval={4000}
            className="font-semibold w-auto text-zinc-900 dark:text-zinc-100"
          />
        </a>
      </div>
    </footer>
  )
}
