"use client";

import { getAnalytics, isSupported } from "firebase/analytics";
import { app } from "./firebase";

export async function initFirebaseAnalytics() {
  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  return getAnalytics(app);
}