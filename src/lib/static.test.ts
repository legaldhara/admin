import { describe, expect, it } from "vitest";
import { getSidebarData } from "./static";

describe("role-aware admin navigation", () => {
  it("shows co-admin management only to primary ADMIN", () => {
    expect(getSidebarData("ADMIN").map((item) => item.label)).toContain("Co-admins");
    expect(getSidebarData("COADMIN").map((item) => item.label)).not.toContain("Co-admins");
  });
});
