import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import QuickExit from "@/components/QuickExit";
import Wordmark from "@/components/Wordmark";

export default function Home() {
  return (
    <main className="relative z-10 flex h-full min-h-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <Wordmark size="md" asLink={false} />
            <p className="font-sans text-[11px] uppercase tracking-widest text-foreground-tertiary">
              an ai for the moments you can&apos;t be alone
            </p>
          </div>
          <QuickExit />
        </div>
      </header>
      <Chat />
      <Footer />
    </main>
  );
}
