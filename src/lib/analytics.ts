/**
 * PageNest Analytics Tracking System
 * Abstracts tracking events to third-party tools like Google Analytics, PostHog, Plausible, and Vercel Analytics.
 */

interface TrackEventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export const analytics = {
  // Push custom events to providers
  event(name: string, params?: TrackEventParams) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics Event] ${name}:`, params);
      return;
    }

    // Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", name, params);
    }

    // Plausible
    if (typeof window !== "undefined" && (window as any).plausible) {
      (window as any).plausible(name, { props: params });
    }

    // PostHog
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture(name, params);
    }
  },

  // Log user registrations
  trackSignup(provider: string) {
    this.event("user_signup", {
      provider,
      category: "Authentication",
    });
  },

  // Log wizard and AI ebook creations
  trackEbookCreated(theme: string, pageCount: number, timeSpentSec?: number) {
    this.event("ebook_generation_success", {
      theme,
      pageCount,
      duration: timeSpentSec,
      category: "Creation Flow",
    });
  },

  // Log downloads and export files format choice
  trackEbookExport(format: string, ebookId: string) {
    this.event("ebook_export", {
      format,
      ebookId,
      category: "Export Flow",
    });
  },

  // Log template selections
  trackTemplateSelect(templateName: string) {
    this.event("template_select", {
      templateName,
      category: "Workspace",
    });
  },

  // Log billing clicks and conversion checkpoints
  trackUpgradeInitiated(planId: string, billingPeriod: "monthly" | "yearly") {
    this.event("upgrade_checkout_initiated", {
      planId,
      billingPeriod,
      category: "Monetization",
    });
  },

  // Log billing checkout success events
  trackUpgradeSuccess(planId: string, billingPeriod: "monthly" | "yearly") {
    this.event("upgrade_checkout_success", {
      planId,
      billingPeriod,
      category: "Monetization",
    });
  }
};
