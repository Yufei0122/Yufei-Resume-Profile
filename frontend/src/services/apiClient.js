import { env } from "../config/env";

export async function apiGet(path) {
  const response = await fetch(`${env.apiUrl}${path}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

