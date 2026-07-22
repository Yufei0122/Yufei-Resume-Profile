import { apiGet } from "./apiClient";

export function fetchHealth() {
  return apiGet("/api/v1/health");
}

export function fetchProfile() {
  return apiGet("/api/v1/profile");
}

