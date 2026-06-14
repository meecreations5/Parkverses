"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVendorOnboardingById } from "@/lib/vendorService";

export default function VendorDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadVendor() {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const data = await getVendorOnboardingById(id);

      if (!data) {
        setError("Vendor submission not found.");
        return;
      }

      setVendorData(data);
    } catch (loadError) {
      console.error(loadError);
      setError("Unable to load vendor details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendor();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-8">
        <div className="mx-auto max-w-5xl text-gray-600">
          Loading vendor details...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>

          <Link
            href="/vendors"
            className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Vendors
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
              ParkVerses
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Vendor Details
            </h1>

            <p className="mt-2 text-gray-600">
              Submission ID: {vendorData.id}
            </p>
          </div>

          <Link
            href="/vendors"
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            Back to Vendors
          </Link>
        </div>

        <div className="space-y-6">
          <DetailsSection title="Vendor Basic Information">
            <DetailsGrid>
              <Detail label="Vendor Name" value={vendorData.vendor?.vendorName} />
              <Detail
                label="Business Name"
                value={vendorData.vendor?.businessName}
              />
              <Detail label="Vendor Type" value={vendorData.vendor?.vendorType} />
              <Detail
                label="Contact Person"
                value={vendorData.vendor?.contactPersonName}
              />
              <Detail
                label="Mobile Number"
                value={vendorData.vendor?.mobileNumber}
              />
              <Detail
                label="Email Address"
                value={vendorData.vendor?.emailAddress}
              />
              <Detail label="Address" value={vendorData.vendor?.address} wide />
            </DetailsGrid>
          </DetailsSection>

          <DetailsSection title="Parking Slot Requirement">
            <DetailsGrid>
              <Detail
                label="Required Parking Slot Count"
                value={
                  vendorData.parkingSlotRequirement?.requiredParkingSlotCount
                }
              />
              <Detail
                label="Preferred Parking Location"
                value={
                  vendorData.parkingSlotRequirement?.preferredParkingLocation
                }
              />
              <Detail
                label="Preferred Zone / Floor"
                value={vendorData.parkingSlotRequirement?.preferredZoneFloor}
              />
              <Detail
                label="Slot Type"
                value={vendorData.parkingSlotRequirement?.slotType}
              />
              <Detail
                label="Required From Date"
                value={vendorData.parkingSlotRequirement?.requiredFromDate}
              />
            </DetailsGrid>
          </DetailsSection>

          <DetailsSection title="Vendor Input / Requirement">
            <DetailsGrid>
              <Detail
                label="Operating Hours"
                value={vendorData.vendorRequirement?.operatingHours}
              />
              <Detail
                label="Electricity Required"
                value={vendorData.vendorRequirement?.electricityRequired}
              />
              <Detail
                label="Water Required"
                value={vendorData.vendorRequirement?.waterRequired}
              />
              <Detail
                label="Branding / Signage Required"
                value={vendorData.vendorRequirement?.brandingRequired}
              />
              <Detail
                label="Special Requirements"
                value={vendorData.vendorRequirement?.specialRequirements}
                wide
              />
            </DetailsGrid>
          </DetailsSection>

          <DetailsSection title="Infrastructure Requirements">
            {!vendorData.infrastructureRequirements?.length && (
              <p className="text-sm text-gray-500">
                No infrastructure requirements added.
              </p>
            )}

            <div className="space-y-4">
              {vendorData.infrastructureRequirements?.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >
                  <h3 className="mb-4 font-semibold text-gray-950">
                    Infrastructure #{index + 1}
                  </h3>

                  <DetailsGrid>
                    <Detail
                      label="Infrastructure Name"
                      value={item.infrastructureName}
                    />
                    <Detail label="Quantity / Count" value={item.quantity} />
                    <Detail
                      label="Requirement Type"
                      value={item.requirementType}
                    />
                    <Detail label="Priority" value={item.priority} />
                    <Detail label="Remarks" value={item.remarks} wide />
                  </DetailsGrid>
                </div>
              ))}
            </div>
          </DetailsSection>

          <DetailsSection title="Suggestion / Feedback">
            <DetailsGrid>
              <Detail
                label="Suggestion Title"
                value={vendorData.suggestion?.suggestionTitle}
              />
              <Detail
                label="Suggestion Category"
                value={vendorData.suggestion?.suggestionCategory}
              />
              <Detail
                label="Suggestion Description"
                value={vendorData.suggestion?.suggestionDescription}
                wide
              />
            </DetailsGrid>
          </DetailsSection>
        </div>
      </div>
    </main>
  );
}

function DetailsSection({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold text-gray-950">{title}</h2>
      {children}
    </section>
  );
}

function DetailsGrid({ children }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Detail({ label, value, wide = false }) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
}