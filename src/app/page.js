import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
          ParkVerses
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950">
          Vendor Onboarding Application
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600">
          Add vendors, collect parking slot requirements, manually add
          infrastructure requirements, and store suggestions in Firebase
          Firestore.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/vendors/new"
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Add Vendor
          </Link>

          <Link
            href="/vendors"
            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            View Vendors
          </Link>
        </div>
      </div>
    </main>
  );
}