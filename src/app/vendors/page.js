"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getVendorOnboardingList } from "@/lib/vendorService";

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [interestFilter, setInterestFilter] = useState("all");
  const [readinessFilter, setReadinessFilter] = useState("all");
  const [followUpFilter, setFollowUpFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  async function loadVendors() {
    try {
      setLoading(true);
      setError("");

      const data = await getVendorOnboardingList();
      setVendors(data);
    } catch (loadError) {
      console.error(loadError);
      setError("Unable to load survey submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    return vendors.filter((item) => {
      const vendorName = item.vendor?.vendorName || "";
      const businessName = item.vendor?.businessName || "";
      const contactPerson = item.vendor?.contactPersonName || "";
      const mobileNumber = item.vendor?.mobileNumber || "";
      const parkingLocation =
        item.parkingSlotRequirement?.preferredParkingLocation || "";
      const engagementType = item.vendorRequirement?.engagementType || "";
      const collaborationInterest =
        item.vendorRequirement?.collaborationInterest || "";
      const readinessStatus = item.vendorRequirement?.readinessStatus || "";
      const followUpRequired = item.vendorRequirement?.followUpRequired || "";

      const searchableText = [
        vendorName,
        businessName,
        contactPerson,
        mobileNumber,
        parkingLocation,
        engagementType,
        collaborationInterest,
        readinessStatus,
        followUpRequired,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

      const matchesInterest =
        interestFilter === "all" || collaborationInterest === interestFilter;

      const matchesReadiness =
        readinessFilter === "all" || readinessStatus === readinessFilter;

      const matchesFollowUp =
        followUpFilter === "all" || followUpRequired === followUpFilter;

      return (
        matchesSearch &&
        matchesInterest &&
        matchesReadiness &&
        matchesFollowUp
      );
    });
  }, [vendors, searchTerm, interestFilter, readinessFilter, followUpFilter]);

  const stats = useMemo(() => {
    const interestedCount = vendors.filter((item) =>
      ["Interested", "Interested but needs more discussion"].includes(
        item.vendorRequirement?.collaborationInterest
      )
    ).length;

    const readyCount = vendors.filter(
      (item) =>
        item.vendorRequirement?.readinessStatus === "Ready to Collaborate"
    ).length;

    const followUpCount = vendors.filter(
      (item) => item.vendorRequirement?.followUpRequired === "Yes"
    ).length;

    const fileCount = vendors.reduce(
      (total, item) => total + (item.attachments?.length || 0),
      0
    );

    return {
      total: vendors.length,
      interested: interestedCount,
      ready: readyCount,
      followUp: followUpCount,
      files: fileCount,
    };
  }, [vendors]);

  const interestOptions = getUniqueOptions(
    vendors.map((item) => item.vendorRequirement?.collaborationInterest)
  );

  const readinessOptions = getUniqueOptions(
    vendors.map((item) => item.vendorRequirement?.readinessStatus)
  );

  const followUpOptions = getUniqueOptions(
    vendors.map((item) => item.vendorRequirement?.followUpRequired)
  );

  const hasActiveFilters =
    searchTerm ||
    interestFilter !== "all" ||
    readinessFilter !== "all" ||
    followUpFilter !== "all";

  function clearFilters() {
    setSearchTerm("");
    setInterestFilter("all");
    setReadinessFilter("all");
    setFollowUpFilter("all");
  }

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
                Survey Dashboard
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden rounded-xl border-2 border-[#171717] bg-white px-4 py-2 text-xs font-black text-[#171717] shadow-[2px_2px_0px_#dc7633] sm:inline-flex"
            >
              Home
            </Link>

            <Link
              href="/vendors/new"
              className="rounded-xl border-2 border-[#171717] bg-[#171717] px-4 py-2 text-xs font-black text-white shadow-[2px_2px_0px_#dc7633] sm:px-5 sm:py-3 sm:text-sm"
            >
              + New Survey
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-4 pb-20 sm:px-5 sm:py-6 lg:py-8">
        {/* Hero Header */}
        <div className="mb-5 overflow-hidden rounded-[2rem] border-4 border-[#171717] bg-[#f7df00] shadow-[8px_8px_0px_#171717] sm:mb-7">
          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-[#fff685] sm:h-36 sm:w-36" />
            <div className="pointer-events-none absolute -bottom-6 right-14 hidden h-24 w-24 rounded-full bg-[#dc7633]/30 sm:block" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="mb-4 inline-flex rounded-full border-2 border-[#171717] bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#171717] sm:px-4 sm:py-2 sm:text-xs">
                  Survey List
                </div>

                <h1 className="max-w-3xl text-2xl font-black tracking-tight text-[#171717] sm:text-4xl md:text-5xl">
                  Parking Survey & Collaboration List
                </h1>

                <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-[#5f5600] sm:text-base sm:leading-7">
                  View parking place surveys, vendor discussions, expectations,
                  concerns, collaboration readiness, follow-ups, requirements
                  and uploaded files.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex">
                <HeroMiniStat label="Total" value={stats.total} />
                <HeroMiniStat label="Ready" value={stats.ready} />
                <HeroMiniStat label="Follow-up" value={stats.followUp} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="mb-5 md:hidden">
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <StatCard label="Total" value={stats.total} compact />
            <StatCard label="Interested" value={stats.interested} compact />
            <StatCard label="Ready" value={stats.ready} compact />
            <StatCard label="Follow-ups" value={stats.followUp} compact />
            <StatCard label="Files" value={stats.files} compact />
          </div>
        </div>

        {/* Desktop Stats */}
        <div className="mb-6 hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Surveys" value={stats.total} />
          <StatCard label="Interested" value={stats.interested} />
          <StatCard label="Ready" value={stats.ready} />
          <StatCard label="Follow-ups" value={stats.followUp} />
          <StatCard label="Files" value={stats.files} />
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-[1.7rem] border-2 border-[#171717] bg-white p-4 shadow-[5px_5px_0px_#f7df00] sm:p-5">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <div>
              <p className="text-sm font-black text-[#171717]">
                Search & Filters
              </p>
              <p className="mt-1 text-xs font-semibold text-gray-500">
                Filter survey submissions
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowMobileFilters((previous) => !previous)}
              className="rounded-xl bg-[#171717] px-4 py-2 text-xs font-black text-white"
            >
              {showMobileFilters ? "Hide" : "Show"}
            </button>
          </div>

          <div
            className={`mt-4 grid gap-3 lg:mt-0 lg:grid lg:grid-cols-[1.4fr_1fr_1fr_0.8fr] ${
              showMobileFilters ? "grid" : "hidden lg:grid"
            }`}
          >
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-[#756600]">
                Search
              </span>

              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search vendor, contact, location..."
                className="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[#171717] focus:ring-2 focus:ring-[#f7df00]"
              />
            </label>

            <FilterSelect
              label="Collaboration Interest"
              value={interestFilter}
              onChange={setInterestFilter}
              options={interestOptions}
            />

            <FilterSelect
              label="Readiness"
              value={readinessFilter}
              onChange={setReadinessFilter}
              options={readinessOptions}
            />

            <FilterSelect
              label="Follow-up"
              value={followUpFilter}
              onChange={setFollowUpFilter}
              options={followUpOptions}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-xl border-2 border-[#171717] bg-[#f7df00] px-4 py-2 text-xs font-black text-[#171717] transition hover:bg-[#ffe85a]"
            >
              Clear Filters
            </button>
          )}
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-sm font-black text-red-700">
            {error}
          </div>
        )}

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {loading && <LoadingCard />}

          {!loading && filteredVendors.length === 0 && <EmptyState />}

          <div className="space-y-4">
            {!loading &&
              filteredVendors.map((item) => (
                <VendorMobileCard key={item.id} item={item} />
              ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-[1.7rem] border-2 border-[#171717] bg-white shadow-[5px_5px_0px_#f7df00] lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse text-left">
              <thead className="bg-[#f7df00]">
                <tr>
                  <TableHead>Vendor / Place</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Parking Survey</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Readiness</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Req.</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Action</TableHead>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td className="px-5 py-6 text-gray-500" colSpan="10">
                      Loading survey submissions...
                    </td>
                  </tr>
                )}

                {!loading && filteredVendors.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-gray-500" colSpan="10">
                      No survey submissions found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredVendors.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t-2 border-gray-100 transition hover:bg-[#fffdf0]"
                    >
                      <td className="px-5 py-4 align-top">
                        <div className="max-w-[220px]">
                          <div className="font-black text-[#171717]">
                            {item.vendor?.vendorName || "-"}
                          </div>

                          <div className="mt-1 text-sm font-semibold text-gray-500">
                            {item.vendor?.businessName || "-"}
                          </div>

                          <div className="mt-2">
                            <span className="rounded-full border border-[#171717]/10 bg-[#fff8a3] px-3 py-1 text-xs font-black text-[#171717]">
                              {item.vendor?.vendorType || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="text-sm font-black text-[#171717]">
                          {item.vendor?.contactPersonName || "-"}
                        </div>

                        <div className="mt-1 text-sm font-semibold text-gray-500">
                          {item.vendor?.mobileNumber || "-"}
                        </div>

                        <div className="mt-1 text-xs font-semibold text-gray-400">
                          {item.vendor?.emailAddress || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="max-w-[200px]">
                          <div className="text-sm font-black text-[#171717]">
                            {item.parkingSlotRequirement
                              ?.preferredParkingLocation || "-"}
                          </div>

                          <div className="mt-1 text-xs font-semibold text-gray-500">
                            {item.parkingSlotRequirement?.preferredZoneFloor ||
                              "-"}
                          </div>

                          <div className="mt-2 text-xs font-black text-[#756600]">
                            Slots:{" "}
                            {item.parkingSlotRequirement
                              ?.requiredParkingSlotCount || "-"}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <StatusPill
                          value={
                            item.vendorRequirement?.collaborationInterest ||
                            "Not updated"
                          }
                          type="interest"
                        />
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="max-w-[180px] text-sm font-semibold text-gray-700">
                          {item.vendorRequirement?.engagementType || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <StatusPill
                          value={
                            item.vendorRequirement?.readinessStatus ||
                            "Not updated"
                          }
                          type="readiness"
                        />
                      </td>

                      <td className="px-5 py-4 align-top">
                        <FollowUpBadge
                          value={item.vendorRequirement?.followUpRequired}
                        />
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1 text-sm font-semibold text-gray-700">
                          <p>
                            Points:{" "}
                            <span className="font-black text-[#171717]">
                              {item.vendorRequirement?.requirements?.length ||
                                0}
                            </span>
                          </p>
                          <p>
                            Infra:{" "}
                            <span className="font-black text-[#171717]">
                              {item.infrastructureRequirements?.length || 0}
                            </span>
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span className="rounded-full bg-[#171717] px-3 py-1 text-xs font-black text-white">
                          {item.attachments?.length || 0}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <Link
                          href={`/vendors/${item.id}`}
                          className="inline-flex rounded-xl border-2 border-[#171717] bg-[#171717] px-4 py-2 text-xs font-black text-white shadow-[3px_3px_0px_#f7df00] transition hover:bg-black"
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
      </section>
    </main>
  );
}

function HeroMiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border-2 border-[#171717] bg-white px-4 py-3 shadow-[3px_3px_0px_#dc7633]">
      <p className="text-[10px] font-black uppercase tracking-wide text-[#756600]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-[#171717]">{value}</p>
    </div>
  );
}

function VendorMobileCard({ item }) {
  return (
    <div className="rounded-[1.7rem] border-2 border-[#171717] bg-white p-4 shadow-[5px_5px_0px_#f7df00]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-[#171717]">
            {item.vendor?.vendorName || "-"}
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-500">
            {item.vendor?.businessName || item.vendor?.vendorType || "-"}
          </p>
        </div>

        <Link
          href={`/vendors/${item.id}`}
          className="shrink-0 rounded-xl bg-[#171717] px-4 py-2 text-xs font-black text-white"
        >
          View
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        <InfoRow label="Contact" value={item.vendor?.contactPersonName} />
        <InfoRow label="Mobile" value={item.vendor?.mobileNumber} />
        <InfoRow
          label="Location"
          value={item.parkingSlotRequirement?.preferredParkingLocation}
        />
        <InfoRow
          label="Slots"
          value={item.parkingSlotRequirement?.requiredParkingSlotCount}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatusPill
          value={item.vendorRequirement?.collaborationInterest || "Not updated"}
          type="interest"
        />

        <StatusPill
          value={item.vendorRequirement?.readinessStatus || "Not updated"}
          type="readiness"
        />

        <FollowUpBadge value={item.vendorRequirement?.followUpRequired} />
      </div>

      <div className="mt-4 rounded-2xl bg-[#fff8a3] p-3">
        <p className="text-xs font-black uppercase tracking-wide text-[#756600]">
          Engagement Type
        </p>

        <p className="mt-1 text-sm font-black text-[#171717]">
          {item.vendorRequirement?.engagementType || "-"}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <SmallCount
          label="Points"
          value={item.vendorRequirement?.requirements?.length || 0}
        />
        <SmallCount
          label="Infra"
          value={item.infrastructureRequirements?.length || 0}
        />
        <SmallCount label="Files" value={item.attachments?.length || 0} />
      </div>
    </div>
  );
}

function StatCard({ label, value, compact = false }) {
  return (
    <div
      className={`rounded-[1.6rem] border-2 border-[#171717] bg-white shadow-[4px_4px_0px_#f7df00] ${
        compact ? "min-w-[130px] snap-start p-4" : "p-5"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-wide text-[#756600]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-[#171717]">{value}</p>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-[#756600]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-[#171717] outline-none transition focus:border-[#171717] focus:ring-2 focus:ring-[#f7df00]"
      >
        <option value="all">All</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-[#171717]">
      {children}
    </th>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl bg-gray-50 px-3 py-2">
      <p className="text-xs font-black uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="max-w-[60%] text-right text-sm font-black text-[#171717]">
        {value || "-"}
      </p>
    </div>
  );
}

function SmallCount({ label, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3">
      <p className="text-lg font-black text-[#171717]">{value}</p>
      <p className="mt-1 text-xs font-bold text-gray-500">{label}</p>
    </div>
  );
}

function StatusPill({ value, type }) {
  return (
    <span className={getStatusClass(value, type)}>
      {value || "Not updated"}
    </span>
  );
}

function FollowUpBadge({ value }) {
  const normalizedValue = value || "Not updated";

  let className =
    "inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ";

  if (normalizedValue === "Yes") {
    className += "border-orange-200 bg-orange-100 text-orange-700";
  } else if (normalizedValue === "No") {
    className += "border-green-200 bg-green-100 text-green-700";
  } else if (normalizedValue === "Maybe") {
    className += "border-yellow-200 bg-yellow-100 text-yellow-700";
  } else {
    className += "border-gray-200 bg-gray-100 text-gray-600";
  }

  return <span className={className}>Follow-up: {normalizedValue}</span>;
}

function getStatusClass(value, type) {
  const base =
    "inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ";

  if (type === "interest") {
    if (value === "Interested") {
      return base + "border-green-200 bg-green-100 text-green-700";
    }

    if (value === "Interested but needs more discussion") {
      return base + "border-blue-200 bg-blue-100 text-blue-700";
    }

    if (value === "Maybe / Exploring") {
      return base + "border-yellow-200 bg-yellow-100 text-yellow-700";
    }

    if (value === "Not Interested") {
      return base + "border-red-200 bg-red-100 text-red-700";
    }

    if (value === "Already Collaborating") {
      return base + "border-purple-200 bg-purple-100 text-purple-700";
    }
  }

  if (type === "readiness") {
    if (value === "Ready to Collaborate") {
      return base + "border-green-200 bg-green-100 text-green-700";
    }

    if (
      [
        "Need Follow-up Discussion",
        "Need Commercial Proposal",
        "Need Site Visit",
        "Need Internal Approval",
      ].includes(value)
    ) {
      return base + "border-orange-200 bg-orange-100 text-orange-700";
    }

    if (value === "Not Ready Currently") {
      return base + "border-yellow-200 bg-yellow-100 text-yellow-700";
    }

    if (value === "Not Interested") {
      return base + "border-red-200 bg-red-100 text-red-700";
    }
  }

  return base + "border-gray-200 bg-gray-100 text-gray-600";
}

function getUniqueOptions(values) {
  return values
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function LoadingCard() {
  return (
    <div className="rounded-[1.7rem] border-2 border-[#171717] bg-white p-5 text-sm font-black text-gray-500 shadow-[5px_5px_0px_#f7df00]">
      Loading survey submissions...
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.7rem] border-2 border-dashed border-[#171717] bg-white p-8 text-center shadow-[5px_5px_0px_#f7df00]">
      <p className="text-lg font-black text-[#171717]">
        No survey submissions found
      </p>

      <p className="mt-2 text-sm font-semibold text-gray-500">
        Add a new parking place survey or clear your filters.
      </p>

      <Link
        href="/vendors/new"
        className="mt-5 inline-flex rounded-2xl border-2 border-[#171717] bg-[#171717] px-5 py-3 text-sm font-black text-white shadow-[3px_3px_0px_#f7df00]"
      >
        + New Survey
      </Link>
    </div>
  );
}