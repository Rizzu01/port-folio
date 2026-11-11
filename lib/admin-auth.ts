import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "creative_rizz_admin";
const SESSION_SECONDS = 8 * 60 * 60;

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length >= 16 ? password : null;
}

function signTimestamp(timestamp: string, password: string) {
  return createHmac("sha256", password).update("creative-rizz-admin:" + timestamp).digest("hex");
}

export function isAdminConfigured() {
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(candidate: unknown) {
  const password = getAdminPassword();
  if (!password || typeof candidate !== "string") return false;
  const expected = Buffer.from(password);
  const actual = Buffer.from(candidate);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createAdminSessionToken() {
  const password = getAdminPassword();
  if (!password) throw new Error("ADMIN_PASSWORD must contain at least 16 characters.");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  return timestamp + "." + signTimestamp(timestamp, password);
}

export function isAdminAuthenticated(request: NextRequest) {
  const password = getAdminPassword();
  if (!password) return false;

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;

  const [timestamp, signature, extra] = token.split(".");
  if (!timestamp || !signature || extra || !/^\d{10}$/.test(timestamp)) return false;

  const issuedAt = Number(timestamp);
  const now = Math.floor(Date.now() / 1000);
  if (issuedAt > now + 60 || now - issuedAt > SESSION_SECONDS) return false;

  const expected = Buffer.from(signTimestamp(timestamp, password));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const ADMIN_SESSION_SECONDS = SESSION_SECONDS;
