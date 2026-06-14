import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fffdf0] text-[#171717]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b-4 border-[#171717] bg-[#f7df00]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-[#171717] bg-[#dc7633] text-xs font-black text-white sm:h-11 sm:w-11 sm:text-sm">
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
            className="rounded-xl border-2 border-[#171717] bg-[#171717] px-4 py-2 text-xs font-black text-white shadow-[2px_2px_0px_#dc7633] sm:px-5 sm:py-3 sm:text-sm"
          >
            View Surveys
          </Link>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-4 py-6 sm:px-5 lg:py-10">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left Hero */}
          <div className="overflow-hidden rounded-[2rem] border-4 border-[#171717] bg-[#f7df00] shadow-[8px_8px_0px_#171717]">
            <div className="relative p-5 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-bl-[4rem] bg-[#fff685] sm:h-44 sm:w-44 sm:rounded-bl-[6rem]" />
              <div className="pointer-events-none absolute -bottom-8 right-16 hidden h-32 w-32 rounded-full bg-[#dc7633]/30 sm:block" />

              <div className="relative">
                <div className="mb-5 inline-flex rounded-full border-2 border-[#171717] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#171717] sm:text-xs">
                  Parking Place Survey
                </div>

                <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#171717] sm:text-5xl lg:text-6xl">
                  Survey, Confirm & Collaborate With Parking Partners
                </h1>

                <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-[#5f5600] sm:text-base">
                  Capture vendor discussions, parking place availability,
                  expectations, concerns, collaboration readiness, engagement
                  type, follow-up needs, photos, and documents in one simple
                  ParkVerses workflow.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/vendors/new"
                    className="inline-flex justify-center rounded-2xl border-2 border-[#171717] bg-[#171717] px-6 py-4 text-sm font-black text-white shadow-[4px_4px_0px_#dc7633] transition hover:bg-black"
                  >
                    + Start New Survey
                  </Link>

                  <Link
                    href="/vendors"
                    className="inline-flex justify-center rounded-2xl border-2 border-[#171717] bg-white px-6 py-4 text-sm font-black text-[#171717] shadow-[4px_4px_0px_#dc7633] transition hover:bg-[#fffdf0]"
                  >
                    View Survey List
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InfoCard label="Form Type" value="Survey + Confirmation" />
                  <InfoCard label="Purpose" value="Collaboration Readiness" />
                  <InfoCard label="Storage" value="Firebase" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-5">
            <div className="rounded-[2rem] border-4 border-[#171717] bg-white p-5 shadow-[7px_7px_0px_#f7df00] sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#dc7633]">
                What you can capture
              </p>

              <div className="mt-5 space-y-3">
                <FeatureItem
                  number="01"
                  title="Parking Place Details"
                  description="Vendor, owner, location, slot count, type and availability."
                />

                <FeatureItem
                  number="02"
                  title="Discussion & Expectations"
                  description="Record what was discussed and what the vendor expects from ParkVerses."
                />

                <FeatureItem
                  number="03"
                  title="Concerns & Blockers"
                  description="Capture rent, permissions, access, electricity, footfall or commercial concerns."
                />

                <FeatureItem
                  number="04"
                  title="Collaboration Readiness"
                  description="Know whether they are ready, need follow-up, proposal, approval or site visit."
                />

                <FeatureItem
                  number="05"
                  title="Files & Photos"
                  description="Upload parking site photos, documents, references or confirmation files."
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <QuickCard
                title="New Survey"
                description="Start a guided survey wizard."
                href="/vendors/new"
                action="Start"
              />

              <QuickCard
                title="Survey List"
                description="Track all submissions and follow-ups."
                href="/vendors"
                action="Open"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border-2 border-[#171717] bg-white px-4 py-3 shadow-[3px_3px_0px_#dc7633]">
      <p className="text-[10px] font-black uppercase tracking-wide text-[#756600] sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-[#171717]">{value}</p>
    </div>
  );
}

function FeatureItem({ number, title, description }) {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-[#fffdf0] p-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-xs font-black text-white">
          {number}
        </div>

        <div>
          <h3 className="text-sm font-black text-[#171717]">{title}</h3>
          <p className="mt-1 text-xs font-semibold leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickCard({ title, description, href, action }) {
  return (
    <Link
      href={href}
      className="group rounded-[1.7rem] border-2 border-[#171717] bg-white p-5 shadow-[5px_5px_0px_#f7df00] transition hover:-translate-y-0.5"
    >
      <p className="text-lg font-black text-[#171717]">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
        {description}
      </p>

      <div className="mt-4 inline-flex rounded-xl bg-[#171717] px-4 py-2 text-xs font-black text-white transition group-hover:bg-black">
        {action} →
      </div>
    </Link>
  );
}