'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export function MagazineContactForm() {
  const { toast } = useToast()
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    await new Promise((r) => setTimeout(r, 600))
    toast({
      title: 'Message received',
      description: 'Thanks for reaching out. We read every note and will reply when we can.',
    })
    ;(e.target as HTMLFormElement).reset()
    setPending(false)
  }

  return (
    <div className="rounded-[2rem] border border-slate-200/90 bg-white p-8 shadow-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">Write to us</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">Send a message</h2>
      <p className="mt-2 text-sm text-slate-600">
        Pitches, corrections, partnership ideas, or reader feedback—include enough context so we can route it quickly.
      </p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm outline-none ring-[#1a9b8f]/30 focus:border-[#1a9b8f] focus:ring-4"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm outline-none ring-[#1a9b8f]/30 focus:border-[#1a9b8f] focus:ring-4"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-medium text-slate-700">
            Topic
          </label>
          <input
            id="contact-topic"
            name="topic"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm outline-none ring-[#1a9b8f]/30 focus:border-[#1a9b8f] focus:ring-4"
            placeholder="e.g. Story pitch, typo in an article, advertising"
          />
        </div>
        <div>
          <label htmlFor="contact-body" className="mb-1.5 block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="contact-body"
            name="message"
            required
            rows={6}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none ring-[#1a9b8f]/30 focus:border-[#1a9b8f] focus:ring-4"
            placeholder="Share links, deadlines, or anything else we should know."
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="h-12 rounded-full bg-[#1a9b8f] text-base font-semibold text-white hover:bg-[#158a7f] disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send message
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
