import Link from "next/link";
import { Ornament } from "@/components/ui/Ornament";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-48 text-center">
      <p className="label text-gold">Uncharted</p>
      <h1 className="display mt-5 text-5xl text-parchment sm:text-6xl">This region of the sky is not yet mapped.</h1>
      <Ornament className="mt-12" />
      <p className="mt-10">
        <Link href="/atlas" className="label text-gold hover:text-gold-soft">Return to the Atlas</Link>
      </p>
    </div>
  );
}
