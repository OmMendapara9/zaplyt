import Image from "next/image";
import Link from "next/link";

export default function Logo({ width = 120, height = 40 }: { width?: number; height?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white shadow-sm">
        <Image
          src="/images/logo.png"
          alt="Zaplyt logo"
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <span className="text-lg font-bold text-slate-900 tracking-tight">Zaplyt</span>
    </Link>
  );
}
