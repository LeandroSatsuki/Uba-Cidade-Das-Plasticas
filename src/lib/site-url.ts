function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredSiteUrl) {
    return trimTrailingSlash(configuredSiteUrl);
  }

  const netlifySiteUrl = process.env.URL?.trim();
  if (netlifySiteUrl) {
    return trimTrailingSlash(netlifySiteUrl);
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return trimTrailingSlash(window.location.origin);
  }

  return "http://localhost:3000";
}
