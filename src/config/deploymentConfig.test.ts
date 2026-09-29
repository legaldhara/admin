import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("admin deployment configuration", () => {
  it("defines Cloudflare Pages routing and CI checks", () => {
    expect(readFileSync(".env.example", "utf8")).toContain("VITE_BACKEND_API_URL=");
    expect(existsSync("public/_redirects")).toBe(false);
    expect(readFileSync("public/_headers", "utf8")).toContain("X-Content-Type-Options: nosniff");
    const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
    expect(workflow).toContain("node-version: 22");
    for (const command of ["npm ci", "npm test", "npm run lint", "tsc -b", "npm run build"]) {
      expect(workflow).toContain(command);
    }
  });

  it("builds for the root of the dedicated admin domain", () => {
    expect(readFileSync("vite.config.ts", "utf8")).toContain("base: '/'");
    expect(readFileSync("src/main.tsx", "utf8")).not.toContain("basename='/admin'");
  });

  it("does not ship stale Firebase credentials or request notifications during login", () => {
    const worker = readFileSync("public/firebase-messaging-sw.js", "utf8");
    expect(worker).not.toMatch(/AIza[0-9A-Za-z_-]{20,}/);
    expect(worker).not.toContain("chotu-app-a37c6");
    expect(readFileSync("src/App.tsx", "utf8")).not.toContain("Notification.requestPermission");
  });
});
