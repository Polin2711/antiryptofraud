import Link from "next/link";
import Logo from "@/components/icons/logo";

export default function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-lg font-bold text-primary">Scam Alert</span>
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
              BETA
            </span>
          </div>
        </Link>
        {/* Mantengo el espacio para posibles elementos a la derecha (ej. select de idioma, enlaces) */}
      </div>
    </header>
  );
}