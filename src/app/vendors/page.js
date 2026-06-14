"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getVendorOnboardingList } from "@/lib/vendorService";

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadVendors() {
    try {
      setLoading(true);
      setError("");

      const data = await getVendorOnboardingList();
      setVendors(data);
    } catch (loadError) {
      console.error(loadError);
      setError("Unable to load vendor submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendors();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
              ParkVerses
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Vendor Onboarding
            </h1>

            <p className="mt-2 text-gray-600">
              View submitted vendor onboarding records.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              Home
            </Link>

            <Link
              href="/vendors/new"
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Add Vendor
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-gray-50">
                <tr>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Parking Location</TableHead>
                  <TableHead>Slots</TableHead>
                  <TableHead>Infrastructure</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td className="px-5 py-6 text-gray-500" colSpan="8">
                      Loading vendor submissions...
                    </td>
                  </tr>
                )}

                {!loading && vendors.length === 0 && (
                  <tr>
                    <td className="px-5 py-6 text-gray-500" colSpan="8">
                      No vendor submissions found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  vendors.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-950">
                          {item.vendor?.vendorName || "-"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.vendor?.businessName || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {item.vendor?.vendorType || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.vendor?.contactPersonName || "-"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.vendor?.mobileNumber || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {item.parkingSlotRequirement
                          ?.preferredParkingLocation || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {item.parkingSlotRequirement
                          ?.requiredParkingSlotCount || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {item.infrastructureRequirements?.length || 0}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold capitalize text-yellow-700">
                          {item.status || "submitted"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/vendors/${item.id}`}
                          className="text-sm font-semibold text-black underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-5 py-4 text-sm font-bold text-gray-600">{children}</th>
  );
}