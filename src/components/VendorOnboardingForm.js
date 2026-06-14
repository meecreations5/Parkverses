"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createVendorOnboarding } from "@/lib/vendorService";
import {
  uploadVendorFiles,
  validateVendorFiles,
} from "@/lib/fileUploadService";

const BRAND = {
  yellow: "#f7df00",
  black: "#171717",
  orange: "#dc7633",
};

const emptyRequirement = {
  title: "",
  priority: "Medium",
  details: "",
};

const emptyInfrastructure = {
  infrastructureName: "",
  quantity: "",
  requirementType: "",
  priority: "Medium",
  remarks: "",
};

const emptyCustomField = {
  label: "",
  value: "",
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

  discussionSummary: "",
  vendorExpectation: "",
  vendorConcerns: "",
  collaborationInterest: "",
  engagementType: "",
  supportRequiredFromParkVerses: "",
  readinessStatus: "",
  followUpRequired: "",
  followUpNotes: "",
  internalSurveyNotes: "",
  operatingHours: "",
  specialRequirements: "",

  requirements: [{ ...emptyRequirement }],
  infrastructureRequirements: [{ ...emptyInfrastructure }],
  customFields: [],
};

const steps = [
  {
    id: "basic",
    number: "01",
    title: "Basic Details",
    shortTitle: "Basic",
    description: "Vendor or parking place contact information.",
  },
  {
    id: "parking",
    number: "02",
    title: "Parking Survey",
    shortTitle: "Parking",
    description: "Capture parking space, slot count and location details.",
  },
  {
    id: "discussion",
    number: "03",
    title: "Discussion Summary",
    shortTitle: "Discussion",
    description: "Record what was discussed, expected and concerning.",
  },
  {
    id: "collaboration",
    number: "04",
    title: "Collaboration Readiness",
    shortTitle: "Collab",
    description: "Understand interest, readiness, engagement and follow-up.",
  },
  {
    id: "requirements",
    number: "05",
    title: "Requirements",
    shortTitle: "Needs",
    description: "Add requirement points and infrastructure one by one.",
  },
  {
    id: "files",
    number: "06",
    title: "Files",
    shortTitle: "Files",
    description: "Upload photos, documents and reference files.",
  },
  {
    id: "review",
    number: "07",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Check the summary before final submission.",
  },
];

const quickRequirements = [
  "Parking Space Required",
  "Electricity Required",
  "Water Required",
  "Branding / Signage Required",
  "Storage Space Required",
  "Internet / Wi-Fi Required",
  "Staff Access Required",
  "CCTV Coverage Required",
  "Commercial Proposal Required",
  "Site Visit Required",
];

export default function VendorOnboardingForm() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [form, setForm] = useState(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState("");
  const [error, setError] = useState("");

  const activeStep = steps[activeStepIndex];
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === steps.length - 1;

  const progressPercentage = Math.round(
    ((activeStepIndex + 1) / steps.length) * 100
  );

  const completion = useMemo(() => {
    return {
      basic:
        Boolean(form.vendorName.trim()) &&
        Boolean(form.contactPersonName.trim()) &&
        Boolean(form.mobileNumber.trim()),
      parking:
        Boolean(form.requiredParkingSlotCount) ||
        Boolean(form.preferredParkingLocation.trim()) ||
        Boolean(form.slotType),
      discussion:
        Boolean(form.discussionSummary.trim()) ||
        Boolean(form.vendorExpectation.trim()) ||
        Boolean(form.vendorConcerns.trim()),
      collaboration:
        Boolean(form.collaborationInterest) ||
        Boolean(form.engagementType) ||
        Boolean(form.readinessStatus),
      requirements:
        cleanRequirements().length > 0 || cleanInfrastructure().length > 0,
      files: selectedFiles.length > 0,
      review: false,
    };
  }, [form, selectedFiles]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function updateArrayItem(arrayName, index, field, value) {
    setForm((previous) => {
      const updatedItems = [...previous[arrayName]];

      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      return {
        ...previous,
        [arrayName]: updatedItems,
      };
    });
  }

  function addArrayItem(arrayName, emptyItem) {
    setForm((previous) => ({
      ...previous,
      [arrayName]: [...previous[arrayName], { ...emptyItem }],
    }));
  }

  function removeArrayItem(arrayName, index) {
    setForm((previous) => ({
      ...previous,
      [arrayName]: previous[arrayName].filter(
        (_, currentIndex) => currentIndex !== index
      ),
    }));
  }

  function addQuickRequirement(title) {
    const alreadyAdded = form.requirements.some(
      (item) => item.title.toLowerCase() === title.toLowerCase()
    );

    if (alreadyAdded) return;

    setForm((previous) => ({
      ...previous,
      requirements: [
        ...previous.requirements,
        {
          title,
          priority: "Medium",
          details: "",
        },
      ],
    }));
  }

  function handleFileChange(event) {
    const incomingFiles = Array.from(event.target.files || []);
    const combinedFiles = [...selectedFiles, ...incomingFiles];

    const validationError = validateVendorFiles(combinedFiles);

    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFiles(combinedFiles);
    event.target.value = "";
  }

  function removeSelectedFile(index) {
    setSelectedFiles((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  function validateBasicFields() {
    if (!form.vendorName.trim()) {
      return "Vendor / parking place name is required.";
    }

    if (!form.contactPersonName.trim()) {
      return "Contact person name is required.";
    }

    if (!form.mobileNumber.trim()) {
      return "Mobile number is required.";
    }

    return "";
  }

  function goNext() {
    setError("");

    if (activeStep.id === "basic") {
      const validationError = validateBasicFields();

      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (!isLastStep) {
      setActiveStepIndex((previous) => previous + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    setError("");

    if (!isFirstStep) {
      setActiveStepIndex((previous) => previous - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToStep(index) {
    setError("");
    setActiveStepIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getUploadFolderId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `${Date.now()}`;
  }

  function cleanRequirements() {
    return form.requirements
      .filter((item) => item.title.trim() || item.details.trim())
      .map((item) => ({
        title: item.title.trim(),
        priority: item.priority,
        details: item.details.trim(),
      }));
  }

  function cleanInfrastructure() {
    return form.infrastructureRequirements
      .filter(
        (item) =>
          item.infrastructureName.trim() ||
          item.quantity.trim() ||
          item.requirementType.trim() ||
          item.remarks.trim()
      )
      .map((item) => ({
        infrastructureName: item.infrastructureName.trim(),
        quantity: item.quantity.trim(),
        requirementType: item.requirementType,
        priority: item.priority,
        remarks: item.remarks.trim(),
      }));
  }

  function cleanCustomFields() {
    return form.customFields
      .filter((item) => item.label.trim() || item.value.trim())
      .map((item) => ({
        label: item.label.trim(),
        value: item.value.trim(),
      }));
  }

  async function handleSubmit() {
    setError("");
    setSuccessId("");

    const validationError = validateBasicFields();

    if (validationError) {
      setError(validationError);
      setActiveStepIndex(0);
      return;
    }

    try {
      setLoading(true);

      const uploadFolderId = getUploadFolderId();

      const uploadedFiles = await uploadVendorFiles(
        selectedFiles,
        uploadFolderId
      );

      const payload = {
        formType: "parking_place_vendor_survey",
        uploadFolderId,

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
          requiredParkingSlotCount: form.requiredParkingSlotCount
            ? Number(form.requiredParkingSlotCount)
            : "",
          preferredParkingLocation: form.preferredParkingLocation.trim(),
          preferredZoneFloor: form.preferredZoneFloor.trim(),
          slotType: form.slotType,
          requiredFromDate: form.requiredFromDate,
        },

        vendorRequirement: {
          discussionSummary: form.discussionSummary.trim(),
          vendorExpectation: form.vendorExpectation.trim(),
          vendorConcerns: form.vendorConcerns.trim(),
          collaborationInterest: form.collaborationInterest,
          engagementType: form.engagementType,
          supportRequiredFromParkVerses:
            form.supportRequiredFromParkVerses.trim(),
          readinessStatus: form.readinessStatus,
          followUpRequired: form.followUpRequired,
          followUpNotes: form.followUpNotes.trim(),
          internalSurveyNotes: form.internalSurveyNotes.trim(),
          operatingHours: form.operatingHours.trim(),
          specialRequirements: form.specialRequirements.trim(),
          requirements: cleanRequirements(),
        },

        infrastructureRequirements: cleanInfrastructure(),

        customFields: cleanCustomFields(),

        attachments: uploadedFiles,
      };

      const id = await createVendorOnboarding(payload);

      setSuccessId(id);
      setSelectedFiles([]);
      setForm({
        ...initialFormState,
        requirements: [{ ...emptyRequirement }],
        infrastructureRequirements: [{ ...emptyInfrastructure }],
        customFields: [],
      });
      setActiveStepIndex(0);
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong while submitting the survey.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <div className="rounded-[2rem] border-4 border-[#171717] bg-[#f7df00] p-5 shadow-[8px_8px_0px_#171717]">
          <div className="rounded-[1.6rem] bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#dc7633]">
              ParkVerses
            </p>
            <h1 className="mt-2 text-2xl font-black leading-tight text-[#171717]">
              Parking Survey & Collaboration
            </h1>
            <p className="mt-2 text-sm font-semibold leading-6 text-gray-600">
              Fill one step at a time. Review everything before submit.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => goToStep(index)}
                className={`w-full rounded-2xl border-2 p-3 text-left transition ${
                  activeStepIndex === index
                    ? "border-[#171717] bg-[#171717] text-white shadow-[4px_4px_0px_#dc7633]"
                    : "border-[#171717]/20 bg-white/70 text-[#171717] hover:border-[#171717] hover:bg-white"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                      activeStepIndex === index
                        ? "bg-[#f7df00] text-[#171717]"
                        : "bg-[#171717] text-white"
                    }`}
                  >
                    {step.number}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black">{step.title}</p>
                      {completion[step.id] && (
                        <span className="text-xs font-black">✓</span>
                      )}
                    </div>
                    <p
                      className={`mt-1 text-xs leading-5 ${
                        activeStepIndex === index
                          ? "text-white/70"
                          : "text-gray-600"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        <MobileProgress
          activeStepIndex={activeStepIndex}
          progressPercentage={progressPercentage}
          activeStep={activeStep}
        />

        <div className="mb-5 overflow-hidden rounded-[2rem] border-4 border-[#171717] bg-[#f7df00] shadow-[7px_7px_0px_#171717]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#725f00]">
                  Step {activeStepIndex + 1} of {steps.length}
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#171717] sm:text-3xl">
                  {activeStep.title}
                </h2>

                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#5f5600]">
                  {activeStep.description}
                </p>
              </div>

              <div className="rounded-2xl border-2 border-[#171717] bg-white px-4 py-3">
                <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                  Progress
                </p>
                <p className="mt-1 text-2xl font-black text-[#171717]">
                  {progressPercentage}%
                </p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full border-2 border-[#171717] bg-white">
              <div
                className="h-full bg-[#171717] transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-sm font-black text-red-700">
            {error}
          </div>
        )}

        {successId && (
          <div className="mb-5 rounded-2xl border-2 border-green-300 bg-green-50 p-4 text-sm font-black text-green-700">
            Survey submitted successfully.{" "}
            <Link href={`/vendors/${successId}`} className="underline">
              View submission
            </Link>
          </div>
        )}

        <form
          onSubmit={(event) => event.preventDefault()}
          className="rounded-[2rem] border-4 border-[#171717] bg-white p-4 shadow-[7px_7px_0px_#f7df00] sm:p-6"
        >
          {activeStep.id === "basic" && (
            <BasicStep form={form} handleChange={handleChange} />
          )}

          {activeStep.id === "parking" && (
            <ParkingStep form={form} handleChange={handleChange} />
          )}

          {activeStep.id === "discussion" && (
            <DiscussionStep form={form} handleChange={handleChange} />
          )}

          {activeStep.id === "collaboration" && (
            <CollaborationStep form={form} handleChange={handleChange} />
          )}

          {activeStep.id === "requirements" && (
            <RequirementsStep
              form={form}
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              addQuickRequirement={addQuickRequirement}
            />
          )}

          {activeStep.id === "files" && (
            <FilesStep
              selectedFiles={selectedFiles}
              handleFileChange={handleFileChange}
              removeSelectedFile={removeSelectedFile}
              form={form}
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          )}

          {activeStep.id === "review" && (
            <ReviewStep
              form={form}
              selectedFiles={selectedFiles}
              requirements={cleanRequirements()}
              infrastructure={cleanInfrastructure()}
              customFields={cleanCustomFields()}
            />
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t-2 border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={isFirstStep || loading}
              className="w-full rounded-2xl border-2 border-[#171717] bg-white px-5 py-3 text-sm font-black text-[#171717] transition disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              Back
            </button>

            {!isLastStep ? (
              <button
                type="button"
                onClick={goNext}
                disabled={loading}
                className="w-full rounded-2xl border-2 border-[#171717] bg-[#171717] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0px_#f7df00] transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="sticky bottom-3 z-30 w-full rounded-2xl border-2 border-[#171717] bg-[#171717] px-5 py-4 text-sm font-black text-white shadow-[5px_5px_0px_#f7df00] transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto md:static"
              >
                {loading ? "Submitting..." : "Submit Survey"}
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

function MobileProgress({ activeStepIndex, progressPercentage, activeStep }) {
  return (
    <div className="mb-5 lg:hidden">
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`min-w-[86px] snap-start rounded-2xl border-2 px-3 py-2 text-center ${
              activeStepIndex === index
                ? "border-[#171717] bg-[#171717] text-white"
                : "border-[#171717]/20 bg-white text-[#171717]"
            }`}
          >
            <p className="text-xs font-black">{step.number}</p>
            <p className="mt-1 truncate text-[10px] font-black">
              {step.shortTitle}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border-2 border-[#171717] bg-white p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black text-[#171717]">
            {activeStep.title}
          </p>
          <p className="text-xs font-black text-[#dc7633]">
            {progressPercentage}%
          </p>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-[#f7df00]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function BasicStep({ form, handleChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        label="Vendor / Parking Place Name *"
        name="vendorName"
        value={form.vendorName}
        onChange={handleChange}
        placeholder="Example: ABC Parking Services"
      />

      <Select
        label="Vendor / Place Type"
        name="vendorType"
        value={form.vendorType}
        onChange={handleChange}
        options={[
          "Parking Operator",
          "Parking Owner",
          "Mall / Commercial Parking",
          "Society Parking",
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
        label="Business / Company Name"
        name="businessName"
        value={form.businessName}
        onChange={handleChange}
        placeholder="Example: ABC Mobility Pvt Ltd"
      />

      <Input
        label="Contact Person Name *"
        name="contactPersonName"
        value={form.contactPersonName}
        onChange={handleChange}
        placeholder="Example: Ravi Sharma"
      />

      <Input
        label="Mobile Number *"
        name="mobileNumber"
        value={form.mobileNumber}
        onChange={handleChange}
        placeholder="Example: 9876543210"
      />

      <Input
        label="Email Address"
        name="emailAddress"
        type="email"
        value={form.emailAddress}
        onChange={handleChange}
        placeholder="Example: vendor@example.com"
      />

      <Textarea
        label="Address / Location"
        name="address"
        value={form.address}
        onChange={handleChange}
        className="md:col-span-2"
        placeholder="Enter parking place or vendor address"
      />
    </div>
  );
}

function ParkingStep({ form, handleChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        label="Available / Required Parking Slot Count"
        name="requiredParkingSlotCount"
        type="number"
        min="1"
        value={form.requiredParkingSlotCount}
        onChange={handleChange}
        placeholder="Example: 25"
      />

      <Input
        label="Parking Location / Area"
        name="preferredParkingLocation"
        value={form.preferredParkingLocation}
        onChange={handleChange}
        placeholder="Example: Basement B1, front gate, open plot"
      />

      <Input
        label="Zone / Floor / Landmark"
        name="preferredZoneFloor"
        value={form.preferredZoneFloor}
        onChange={handleChange}
        placeholder="Example: Zone A / Near main entrance"
      />

      <Select
        label="Parking / Slot Type"
        name="slotType"
        value={form.slotType}
        onChange={handleChange}
        options={[
          "Two-Wheeler",
          "Four-Wheeler",
          "EV Charging",
          "Mixed Parking",
          "Reserved Slot",
          "Commercial Slot",
          "Loading / Unloading",
          "Vendor Service Area",
          "Open Parking Space",
        ]}
      />

      <Input
        label="Expected Start / Availability Date"
        name="requiredFromDate"
        type="date"
        value={form.requiredFromDate}
        onChange={handleChange}
      />
    </div>
  );
}

function DiscussionStep({ form, handleChange }) {
  return (
    <div>
      <div className="mb-5 rounded-2xl border-2 border-orange-200 bg-orange-50 p-4">
        <p className="text-sm font-black text-orange-800">
          Most important section
        </p>
        <p className="mt-1 text-sm font-semibold leading-6 text-orange-700">
          Capture what was discussed, what they expect from ParkVerses, and what
          concerns or blockers they have.
        </p>
      </div>

      <div className="grid gap-4">
        <Textarea
          label="Discussion Summary"
          name="discussionSummary"
          value={form.discussionSummary}
          onChange={handleChange}
          placeholder="Example: Discussed parking availability, current challenges, customer flow, revenue opportunity, and possible partnership."
        />

        <Textarea
          label="Vendor / Parking Place Expectation"
          name="vendorExpectation"
          value={form.vendorExpectation}
          onChange={handleChange}
          placeholder="Example: They expect digital visibility, smooth parking operations, signage, and operational support."
        />

        <Textarea
          label="Concerns / Challenges / Blockers"
          name="vendorConcerns"
          value={form.vendorConcerns}
          onChange={handleChange}
          placeholder="Example: Concern about commercial model, rent, footfall, electricity, maintenance, entry/exit flow, or permissions."
        />

        <Textarea
          label="Internal Survey Notes"
          name="internalSurveyNotes"
          value={form.internalSurveyNotes}
          onChange={handleChange}
          placeholder="Example: Location has good visibility. Vendor is positive but pricing discussion is pending."
        />
      </div>
    </div>
  );
}

function CollaborationStep({ form, handleChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Select
        label="Collaboration Interest"
        name="collaborationInterest"
        value={form.collaborationInterest}
        onChange={handleChange}
        options={[
          "Interested",
          "Interested but needs more discussion",
          "Maybe / Exploring",
          "Not Interested",
          "Already Collaborating",
        ]}
      />

      <Select
        label="Engagement Type They Are Looking For"
        name="engagementType"
        value={form.engagementType}
        onChange={handleChange}
        options={[
          "Parking Space Listing",
          "Revenue Sharing Partnership",
          "Fixed Rental Model",
          "Service Partnership",
          "Pilot / Trial Collaboration",
          "Marketing / Branding Collaboration",
          "Operational Support",
          "Technology / App Integration",
          "Survey / Confirmation Only",
          "Other",
        ]}
      />

      <Select
        label="Readiness Status"
        name="readinessStatus"
        value={form.readinessStatus}
        onChange={handleChange}
        options={[
          "Ready to Collaborate",
          "Need Follow-up Discussion",
          "Need Commercial Proposal",
          "Need Site Visit",
          "Need Internal Approval",
          "Not Ready Currently",
          "Not Interested",
        ]}
      />

      <Select
        label="Follow-up Required"
        name="followUpRequired"
        value={form.followUpRequired}
        onChange={handleChange}
        options={["Yes", "No", "Maybe"]}
      />

      <Input
        label="Operating Hours"
        name="operatingHours"
        value={form.operatingHours}
        onChange={handleChange}
        placeholder="Example: 9 AM to 9 PM"
      />

      <Textarea
        label="Support Required From ParkVerses"
        name="supportRequiredFromParkVerses"
        value={form.supportRequiredFromParkVerses}
        onChange={handleChange}
        className="md:col-span-2"
        placeholder="Example: Need onboarding support, signage, digital listing, customer flow, operational coordination, or commercial proposal."
      />

      {form.followUpRequired !== "No" && (
        <Textarea
          label="Follow-up Notes"
          name="followUpNotes"
          value={form.followUpNotes}
          onChange={handleChange}
          className="md:col-span-2"
          placeholder="Example: Schedule a follow-up call for commercial discussion next week."
        />
      )}

      <Textarea
        label="Additional Confirmation Notes"
        name="specialRequirements"
        value={form.specialRequirements}
        onChange={handleChange}
        className="md:col-span-2"
        placeholder="Any other observation, requirement, condition, or confirmation point."
      />
    </div>
  );
}

function RequirementsStep({
  form,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  addQuickRequirement,
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-[#171717]">
              Confirmation Points
            </h3>
            <p className="mt-1 text-sm font-semibold text-gray-500">
              Add discussion points or requirements one by one.
            </p>
          </div>

          <button
            type="button"
            onClick={() => addArrayItem("requirements", emptyRequirement)}
            className="w-full rounded-2xl bg-[#171717] px-4 py-3 text-sm font-black text-white sm:w-auto"
          >
            + Add Point
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {quickRequirements.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addQuickRequirement(item)}
              className="rounded-full border-2 border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-700 transition hover:border-[#171717] hover:bg-white"
            >
              + {item}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {form.requirements.map((item, index) => (
            <DynamicCard
              key={index}
              title={`Requirement #${index + 1}`}
              canDelete={form.requirements.length > 1}
              onDelete={() => removeArrayItem("requirements", index)}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Requirement / Confirmation Point"
                  value={item.title}
                  onChange={(event) =>
                    updateArrayItem(
                      "requirements",
                      index,
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="Example: Need commercial proposal"
                />

                <Select
                  label="Priority"
                  value={item.priority}
                  onChange={(event) =>
                    updateArrayItem(
                      "requirements",
                      index,
                      "priority",
                      event.target.value
                    )
                  }
                  options={["Low", "Medium", "High", "Urgent"]}
                />

                <Textarea
                  label="Details"
                  value={item.details}
                  onChange={(event) =>
                    updateArrayItem(
                      "requirements",
                      index,
                      "details",
                      event.target.value
                    )
                  }
                  className="md:col-span-2"
                  placeholder="Add short details about this point"
                />
              </div>
            </DynamicCard>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-gray-100 pt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-[#171717]">
              Infrastructure / Setup
            </h3>
            <p className="mt-1 text-sm font-semibold text-gray-500">
              Add physical, operational or setup requirements.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              addArrayItem("infrastructureRequirements", emptyInfrastructure)
            }
            className="w-full rounded-2xl bg-[#171717] px-4 py-3 text-sm font-black text-white sm:w-auto"
          >
            + Add Infrastructure
          </button>
        </div>

        <div className="space-y-4">
          {form.infrastructureRequirements.map((item, index) => (
            <DynamicCard
              key={index}
              title={`Infrastructure #${index + 1}`}
              canDelete={form.infrastructureRequirements.length > 1}
              onDelete={() =>
                removeArrayItem("infrastructureRequirements", index)
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Infrastructure / Setup Name"
                  value={item.infrastructureName}
                  onChange={(event) =>
                    updateArrayItem(
                      "infrastructureRequirements",
                      index,
                      "infrastructureName",
                      event.target.value
                    )
                  }
                  placeholder="Example: Electricity connection"
                />

                <Input
                  label="Quantity / Count"
                  value={item.quantity}
                  onChange={(event) =>
                    updateArrayItem(
                      "infrastructureRequirements",
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
                    updateArrayItem(
                      "infrastructureRequirements",
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
                    "Operational Support",
                    "Other",
                  ]}
                />

                <Select
                  label="Priority"
                  value={item.priority}
                  onChange={(event) =>
                    updateArrayItem(
                      "infrastructureRequirements",
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
                    updateArrayItem(
                      "infrastructureRequirements",
                      index,
                      "remarks",
                      event.target.value
                    )
                  }
                  className="md:col-span-2"
                  placeholder="Example: Required near entry gate"
                />
              </div>
            </DynamicCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilesStep({
  selectedFiles,
  handleFileChange,
  removeSelectedFile,
  form,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) {
  return (
    <div className="space-y-6">
      <FileUploadBox
        selectedFiles={selectedFiles}
        onFileChange={handleFileChange}
        onRemoveFile={removeSelectedFile}
      />

      <div className="border-t-2 border-gray-100 pt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-[#171717]">
              Custom Fields
            </h3>
            <p className="mt-1 text-sm font-semibold text-gray-500">
              Add any extra information not already covered.
            </p>
          </div>

          <button
            type="button"
            onClick={() => addArrayItem("customFields", emptyCustomField)}
            className="w-full rounded-2xl bg-[#171717] px-4 py-3 text-sm font-black text-white sm:w-auto"
          >
            + Add Field
          </button>
        </div>

        {form.customFields.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-sm font-semibold text-gray-500">
            No custom fields added yet.
          </div>
        )}

        <div className="space-y-4">
          {form.customFields.map((item, index) => (
            <DynamicCard
              key={index}
              title={`Custom Field #${index + 1}`}
              canDelete
              onDelete={() => removeArrayItem("customFields", index)}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Field Name"
                  value={item.label}
                  onChange={(event) =>
                    updateArrayItem(
                      "customFields",
                      index,
                      "label",
                      event.target.value
                    )
                  }
                  placeholder="Example: GST Number"
                />

                <Input
                  label="Field Value"
                  value={item.value}
                  onChange={(event) =>
                    updateArrayItem(
                      "customFields",
                      index,
                      "value",
                      event.target.value
                    )
                  }
                  placeholder="Example: 27ABCDE1234F1Z5"
                />
              </div>
            </DynamicCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  form,
  selectedFiles,
  requirements,
  infrastructure,
  customFields,
}) {
  const summaryCards = [
    {
      label: "Vendor / Place",
      value: form.vendorName || "-",
    },
    {
      label: "Contact",
      value: form.contactPersonName || "-",
    },
    {
      label: "Mobile",
      value: form.mobileNumber || "-",
    },
    {
      label: "Interest",
      value: form.collaborationInterest || "-",
    },
    {
      label: "Engagement",
      value: form.engagementType || "-",
    },
    {
      label: "Readiness",
      value: form.readinessStatus || "-",
    },
    {
      label: "Follow-up",
      value: form.followUpRequired || "-",
    },
    {
      label: "Files",
      value: selectedFiles.length,
    },
  ];

  return (
    <div>
      <div className="mb-5 rounded-2xl border-2 border-[#171717] bg-[#f7df00] p-4">
        <p className="text-sm font-black text-[#171717]">
          Review before submitting
        </p>
        <p className="mt-1 text-sm font-semibold leading-6 text-[#5f5600]">
          Please check the survey details before saving it to Firebase.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4"
          >
            <p className="text-xs font-black uppercase tracking-wide text-gray-500">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-black text-[#171717]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ReviewBlock
          title="Discussion Summary"
          value={form.discussionSummary}
        />
        <ReviewBlock
          title="Vendor Expectations"
          value={form.vendorExpectation}
        />
        <ReviewBlock
          title="Concerns / Blockers"
          value={form.vendorConcerns}
        />
        <ReviewBlock
          title="Support Required"
          value={form.supportRequiredFromParkVerses}
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <CountBox label="Requirement Points" value={requirements.length} />
        <CountBox label="Infrastructure Items" value={infrastructure.length} />
        <CountBox label="Custom Fields" value={customFields.length} />
      </div>
    </div>
  );
}

function DynamicCard({ title, canDelete, onDelete, children }) {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-black text-[#171717]">{title}</p>

        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"
          >
            Delete
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

function FileUploadBox({ selectedFiles, onFileChange, onRemoveFile }) {
  return (
    <div>
      <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-[#171717] bg-[#f7df00]/20 p-6 text-center transition hover:bg-[#f7df00]/30">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={onFileChange}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#171717] bg-white text-2xl shadow-[3px_3px_0px_#f7df00]">
          📎
        </div>

        <p className="mt-3 text-sm font-black text-[#171717]">
          Upload Photos or Documents
        </p>

        <p className="mt-1 text-xs font-semibold leading-5 text-gray-600">
          JPG, PNG, WEBP, or PDF. Maximum 6 files. Each file must be below 5 MB.
        </p>

        <div className="mt-4 inline-flex rounded-xl bg-[#171717] px-4 py-2 text-xs font-black text-white">
          Choose Files
        </div>
      </label>

      {selectedFiles.length > 0 && (
        <div className="mt-5 space-y-3">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-2xl border-2 border-gray-200 bg-white p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#171717]">
                  {file.name}
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-500">
                  {file.type || "File"} • {formatFileSize(file.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="shrink-0 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewBlock({ title, value }) {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-gray-500">
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#171717]">
        {value || "-"}
      </p>
    </div>
  );
}

function CountBox({ label, value }) {
  return (
    <div className="rounded-2xl border-2 border-[#171717] bg-white p-4 text-center shadow-[3px_3px_0px_#f7df00]">
      <p className="text-3xl font-black text-[#171717]">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-wide text-gray-500">
        {label}
      </p>
    </div>
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
      <span className="mb-1.5 block text-sm font-black text-[#171717]">
        {label}
      </span>

      <input
        name={name}
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[#171717] focus:ring-2 focus:ring-[#f7df00]"
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-black text-[#171717]">
        {label}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-[#171717] outline-none transition focus:border-[#171717] focus:ring-2 focus:ring-[#f7df00]"
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

function Textarea({
  label,
  name,
  value,
  onChange,
  className = "",
  placeholder = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-black text-[#171717]">
        {label}
      </span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[#171717] focus:ring-2 focus:ring-[#f7df00]"
      />
    </label>
  );
}

function formatFileSize(size) {
  if (!size) return "0 KB";

  const sizeInKb = size / 1024;

  if (sizeInKb < 1024) {
    return `${sizeInKb.toFixed(1)} KB`;
  }

  return `${(sizeInKb / 1024).toFixed(1)} MB`;
}