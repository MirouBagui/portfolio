import { Mail, MessageSquare } from 'lucide-react'

export function Contact() {
  return (
    <section
      id="contact"
      className="flex min-h-screen flex-col items-center justify-center px-4 py-24"
    >
      <div className="max-w-lg text-center">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
          <span className="text-[var(--color-accent)]">#</span> Get In Touch
        </h2>
        <p className="mb-8 text-white/60">
          Have a project in mind or just want to say hi? Drop me a message.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 font-medium text-white transition-all hover:bg-[var(--color-accent-hover)]"
          >
            <Mail size={18} />
            Send Email
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
          >
            <MessageSquare size={18} />
            Start Chat
          </a>
        </div>
      </div>
    </section>
  )
}
