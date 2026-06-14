"use client";

import { useState } from "react";
import Link from "next/link";
import { createVendorOnboarding } from "@/lib/vendorService";

const emptyInfrastructure = {
  infrastructureName: "",
  quantity: "",
  requirementType: "",
  priority: "Medium",
  remarks: "",
};

const initialFormState = {
  vendorName: "",
  businessName: "",
  vendorType: "",
  contactPersonName: "",
  mobileNumber: "",
  emailAddress: "",
  address: "",

  requiredParkingSlotCount: "",
  preferredParkingLocation: "",
  preferredZoneFloor: "",
  slotType: "",
  requiredFromDate: "",

  operatingHours: "",
  electricityRequired: "No",
  waterRequired: "No",
  brandingRequired: "No",
  specialRequirements: "",

  suggestionTitle: "",
  suggestionCategory: "",
  suggestionDescription: "",

  infrastructureRequirements: [{ ...emptyInfrastructure }],
};

export default function VendorOnboardingForm() {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleInfrastructureChange(index, field, value) {
    setForm((previous) => {
      const updatedInfrastructure = [...previous.infrastructureRequirements];

      updatedInfrastructure[index] = {
        ...updatedInfrastructure[index],
        [field]: value,
      };

      return {
        ...previous,
        infrastructureRequirements: updatedInfrastructure,
      };
    });
  }

  function addInfrastructureRow() {
    setForm((previous) => ({
      ...previous,
      infrastructureRequirements: [
        ...previous.infrastructureRequirements,
        { ...emptyInfrastructure },
      ],
    }));
  }

  function removeInfrastructureRow(index) {
    setForm((previous) => ({
      ...previous,
      infrastructureRequirements: previous.infrastructureRequirements.filter(
        (_, currentIndex) => currentIndex !== index
      ),
    }));
  }

  function validateForm() {
    if (!form.vendorName.trim()) return "Vendor name is required.";
    if (!form.businessName.trim()) return "Business / company name is required.";
    if (!form.vendorType.trim()) return "Vendor type is required.";
    if (!form.contactPersonName.trim()) return "Contact person name is required.";
    if (!form.mobileNumber.trim()) return "Mobile number is required.";
    if (!form.emailAddress.trim()) return "Email address is required.";
    if (!form.requiredParkingSlotCount.trim()) {
      return "Required parking slot count is required.";
    }
    if (!form.preferredParkingLocation.trim()) {
      return "Preferred parking location is required.";
    }
    if (!form.slotType.trim()) return "Slot type is required.";

    const hasInvalidInfrastructure = form.infrastructureRequirements.some(
      (item) => !item.infrastructureName.trim()
    );

    if (hasInvalidInfrastructure) {
      return "Infrastructure name is required for every added row.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccessId("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        vendor: {
          vendorName: form.vendorName.trim(),
          businessName: form.businessName.trim(),
          vendorType: form.vendorType,
          contactPersonName: form.contactPersonName.trim(),
          mobileNumber: form.mobileNumber.trim(),
          emailAddress: form.emailAddress.trim(),
          address: form.address.trim(),
        },

        parkingSlotRequirement: {
          requiredParkingSlotCount: Number(form.requiredParkingSlotCount),
          preferredParkingLocation: form.preferredParkingLocation.trim(),
          preferredZoneFloor: form.preferredZoneFloor.trim(),
          slotType: form.slotType,
          requiredFromDate: form.requiredFromDate,
        },

        vendorRequirement: {
          operatingHours: form.operatingHours.trim(),
          electricityRequired: form.electricityRequired,
          waterRequired: form.waterRequired,
          brandingRequired: form.brandingRequired,
          specialRequirements: form.specialRequirements.trim(),
        },

        infrastructureRequirements: form.infrastructureRequirements.map(
          (item) => ({
            infrastructureName: item.infrastructureName.trim(),
            quantity: item.quantity.trim(),
            requirementType: item.requirementType,
            priority: item.priority,
            remarks: item.remarks.trim(),
          })
        ),

        suggestion: {
          suggestionTitle: form.suggestionTitle.trim(),
          suggestionCategory: form.suggestionCategory,
          suggestionDescription: form.suggestionDescription.trim(),
        },
      };

      const id = await createVendorOnboarding(payload);

      setSuccessId(id);
      setForm({
        ...initialFormState,
        infrastructureRequirements: [{ ...emptyInfrastructure }],
      });
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong while submitting the form.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {successId && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          Vendor information submitted successfully.{" "}
          <Link href={`/vendors/${successId}`} className="underline">
            View submission
          </Link>
        </div>
      )}

      <FormSection title="1. Vendor Basic Information">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Vendor Name *"
            name="vendorName"
            value={form.vendorName}
            onChange={handleChange}
          />

          <Input
            label="Business / Company Name *"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
          />

          <Select
            label="Vendor Type *"
            name="vendorType"
            value={form.vendorType}
            onChange={handleChange}
            options={[
              "Parking Operator",
              "Valet Partner",
              "EV Charging Partner",
              "Cleaning Vendor",
              "Security Vendor",
              "Maintenance Vendor",
              "Food / Kiosk Vendor",
              "Advertising Partner",
              "Other",
            ]}
          />

          <Input
            label="Contact Person Name *"
            name="contactPersonName"
            value={form.contactPersonName}
            onChange={handleChange}
          />

          <Input
            label="Mobile Number *"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
          />

          <Input
            label="Email Address *"
            name="emailAddress"
            type="email"
            value={form.emailAddress}
            onChange={handleChange}
          />

          <Textarea
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="md:col-span-2"
          />
        </div>
      </FormSection>

      <FormSection title="2. Parking Slot Requirement">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Required Parking Slot Count *"
            name="requiredParkingSlotCount"
            type="number"
            min="1"
            value={form.requiredParkingSlotCount}
            onChange={handleChange}
          />

          <Input
            label="Preferred Parking Location *"
            name="preferredParkingLocation"
            value={form.preferredParkingLocation}
            onChange={handleChange}
            placeholder="Example: Basement B1"
          />

          <Input
            label="Preferred Zone / Floor"
            name="preferredZoneFloor"
            value={form.preferredZoneFloor}
            onChange={handleChange}
            placeholder="Example: Zone A / Floor B1"
          />

          <Select
            label="Slot Type *"
            name="slotType"
            value={form.slotType}
            onChange={handleChange}
            options={[
              "Two-Wheeler",
              "Four-Wheeler",
              "EV Charging",
              "Reserved Slot",
              "Commercial Slot",
              "Loading / Unloading",
              "Vendor Service Area",
            ]}
          />

          <Input
            label="Required From Date"
            name="requiredFromDate"
            type="date"
            value={form.requiredFromDate}
            onChange={handleChange}
          />
        </div>
      </FormSection>

      <FormSection title="3. Vendor Input / Requirement">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Operating Hours"
            name="operatingHours"
            value={form.operatingHours}
            onChange={handleChange}
            placeholder="Example: 9 AM to 9 PM"
          />

          <Select
            label="Electricity Required"
            name="electricityRequired"
            value={form.electricityRequired}
            onChange={handleChange}
            options={["Yes", "No"]}
          />

          <Select
            label="Water Required"
            name="waterRequired"
            value={form.waterRequired}
            onChange={handleChange}
            options={["Yes", "No"]}
          />

          <Select
            label="Branding / Signage Required"
            name="brandingRequired"
            value={form.brandingRequired}
            onChange={handleChange}
            options={["Yes", "No"]}
          />

          <Textarea
            label="Special Requirements"
            name="specialRequirements"
            value={form.specialRequirements}
            onChange={handleChange}
            className="md:col-span-2"
          />
        </div>
      </FormSection>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">
              4. Infrastructure Requirement
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add required infrastructure manually one by one.
            </p>
          </div>

          <button
            type="button"
            onClick={addInfrastructureRow}
            className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            + Add Infrastructure
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {form.infrastructureRequirements.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <h3 className="font-semibold text-gray-900">
                  Infrastructure #{index + 1}
                </h3>

                {form.infrastructureRequirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInfrastructureRow(index)}
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Infrastructure Name *"
                  value={item.infrastructureName}
                  onChange={(event) =>
                    handleInfrastructureChange(
                      index,
                      "infrastructureName",
                      event.target.value
                    )
                  }
                  placeholder="Example: Electricity Connection"
                />

                <Input
                  label="Quantity / Count"
                  value={item.quantity}
                  onChange={(event) =>
                    handleInfrastructureChange(
                      index,
                      "quantity",
                      event.target.value
                    )
                  }
                  placeholder="Example: 2"
                />

                <Select
                  label="Requirement Type"
                  value={item.requirementType}
                  onChange={(event) =>
                    handleInfrastructureChange(
                      index,
                      "requirementType",
                      event.target.value
                    )
                  }
                  options={[
                    "New Infrastructure Required",
                    "Existing Infrastructure Needed",
                    "Repair / Upgrade Required",
                    "Temporary Setup",
                    "Permanent Setup",
                    "Other",
                  ]}
                />

                <Select
                  label="Priority"
                  value={item.priority}
                  onChange={(event) =>
                    handleInfrastructureChange(
                      index,
                      "priority",
                      event.target.value
                    )
                  }
                  options={["Low", "Medium", "High", "Urgent"]}
                />

                <Textarea
                  label="Description / Remarks"
                  value={item.remarks}
                  onChange={(event) =>
                    handleInfrastructureChange(
                      index,
                      "remarks",
                      event.target.value
                    )
                  }
                  className="md:col-span-2"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <FormSection title="5. Suggestion / Feedback">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Suggestion Title"
            name="suggestionTitle"
            value={form.suggestionTitle}
            onChange={handleChange}
          />

          <Select
            label="Suggestion Category"
            name="suggestionCategory"
            value={form.suggestionCategory}
            onChange={handleChange}
            options={[
              "Parking Improvement",
              "User Experience",
              "Safety",
              "Maintenance",
              "Pricing",
              "Technology",
              "Signage",
              "Other",
            ]}
          />

          <Textarea
            label="Suggestion Description"
            name="suggestionDescription"
            value={form.suggestionDescription}
            onChange={handleChange}
            className="md:col-span-2"
          />
        </div>
      </FormSection>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-black px-6 py-4 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Vendor Information"}
      </button>
    </form>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold text-gray-950">{title}</h2>
      {children}
    </section>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  min,
  placeholder = "",
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>

      <input
        name={name}
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
      >
        <option value="">Select option</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({ label, name, value, onChange, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}