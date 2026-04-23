import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="flex h-full min-h-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-foreground/5 px-6 py-3">
        <p className="font-sans text-xs uppercase tracking-widest text-foreground/40">
          stay
        </p>
      </header>
      <Chat />
    </main>
  );
}
