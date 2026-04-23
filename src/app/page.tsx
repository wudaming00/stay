import AgeGate from "@/components/AgeGate";
import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import HeaderActions from "@/components/HeaderActions";
import Wordmark from "@/components/Wordmark";

export default function Home() {
  return (
    <main className="relative z-10 flex h-full min-h-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <Wordmark size="md" asLink={false} />
            <p className="hidden font-sans text-[11px] uppercase tracking-widest text-foreground-tertiary sm:block">
              an ai for the moments you can&apos;t be alone
            </p>
          </div>
          <HeaderActions />
        </div>
      </header>
      <AgeGate>
        <Chat />
      </AgeGate>
      <Footer />
    </main>
  );
}
