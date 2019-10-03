import { CookieOptions } from "express";

export default {
  secret: process.env.COOKIE_SECRET,
  domain: process.env.COOKIE_DOMAIN,
} as CookieOptions
