import Link from "next/link";

export default function Logo({ width = 120, height = 40 }: { width?: number; height?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-lg font-bold">Z</span>
      <span className="text-lg font-bold text-slate-900 tracking-tight">Zaplyt</span>
    </Link>
  );
}
