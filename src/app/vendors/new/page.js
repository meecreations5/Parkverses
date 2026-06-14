import Link from "next/link";
import VendorOnboardingForm from "@/components/VendorOnboardingForm";

const steps = [
  {
    number: "01",
    title: "Vendor Details",
    description: "Basic company and contact information",
  },
  {
    number: "02",
    title: "Parking Requirement",
    description: "Slot count, location, zone and slot type",
  },
  {
    number: "03",
    title: "Infrastructure",
    description: "Add requirements manually one by one",
  },
  {
    number: "04",
    title: "Suggestions",
    description: "Collect vendor input and improvement ideas",
  },
];

export default function NewVendorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-sm font-black text-white shadow-sm transition group-hover:scale-105">
              PV
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-gray-950">
                ParkVerses
              </p>
              <p className="text-xs font-medium text-gray-500">
                Vendor Onboarding
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/vendors"
              className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
            >
              View Vendors
            </Link>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-10">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[5rem] bg-orange-100/70" />
            <div className="absolute bottom-0 right-24 h-24 w-24 rounded-t-full bg-slate-100" />

            <div className="relative max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
                New Submission
              </div>

              <h1 className="text-4xl font-black tracking-tight text-gray-950 md:text-5xl">
                Add Vendor Onboarding Request
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                Collect vendor details, parking slot requirements, manual
                infrastructure needs, and suggestions in one simple flow.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    Form Type
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-950">
                    Vendor Intake
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-950">
                    Draft Entry
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    Storage
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-950">
                    Firebase Firestore
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-black text-gray-950">
                  Onboarding Flow
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Complete the sections below to submit a clean vendor request.
                </p>
              </div>

              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-xs font-black text-white">
                        {step.number}
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-gray-950">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-orange-50 p-4">
                <p className="text-sm font-black text-orange-800">
                  UX Note
                </p>
                <p className="mt-1 text-xs leading-5 text-orange-700">
                  Infrastructure can be added manually, so the form is flexible
                  for any vendor type.
                </p>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex flex-col justify-between gap-3 rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-black text-gray-950">
                  Vendor Information Form
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Fields marked with * are required.
                </p>
              </div>

              <Link
                href="/vendors"
                className="inline-flex justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                Back to List
              </Link>
            </div>

            <VendorOnboardingForm />
          </section>
        </div>
      </section>
    </main>
  );
}