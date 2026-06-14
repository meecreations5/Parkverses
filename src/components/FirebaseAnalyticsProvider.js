"use client";

import { useEffect } from "react";
import { initFirebaseAnalytics } from "@/lib/firebaseAnalytics";

export default function FirebaseAnalyticsProvider() {
  useEffect(() => {
    initFirebaseAnalytics();
  }, []);

  return null;
}