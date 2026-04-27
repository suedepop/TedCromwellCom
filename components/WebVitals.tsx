"use client";
import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Convert ms metrics to integers; cls is a unit-less ratio scaled to 1000.
    const value = metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value);
    trackEvent("web_vitals", {
      metric_name: metric.name,
      metric_id: metric.id,
      metric_value: value,
      metric_rating: metric.rating,
      metric_delta: Math.round(metric.delta),
      page: window.location.pathname,
    });
  });
  return null;
}
