import Link from "next/link";
import VendorOnboardingForm from "@/components/VendorOnboardingForm";

export default function NewVendorPage() {
  return (
    <main className="min-h-screen bg-[#fffdf0] text-[#171717]">
      <header className="sticky top-0 z-40 border-b-4 border-[#171717] bg-[#f7df00]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-[#171717] bg-[#dc7633] text-xs font-black text-white sm:h-11 sm:w-11">
              PV
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-[0.18em] text-[#171717] sm:text-sm">
                ParkVerses
              </p>
              <p className="truncate text-xs font-bold text-[#725f00]">
                Survey Console
              </p>
            </div>
          </Link>

          <Link
            href="/vendors"
            className="shrink-0 rounded-xl bg-[#171717] px-4 py-2 text-xs font-black text-white sm:px-5 sm:py-3 sm:text-sm"
          >
            View Surveys
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-4 pb-28 sm:px-5 sm:py-6 lg:py-8">
        <VendorOnboardingForm />
      </section>
    </main>
  );
}