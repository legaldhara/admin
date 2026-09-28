import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("../config/apiClient", () => ({
  secureApi: { post: mocks.post },
}));

import { uploadImages } from "./uploadImages";

describe("uploadImages", () => {
  beforeEach(() => mocks.post.mockReset());

  it("uploads under the files field and returns managed assets", async () => {
    mocks.post.mockResolvedValue({
      data: {
        success: true,
        assets: [{ assetId: "asset-1", url: "https://files.test/a.pdf", publicId: "users/a", mimeType: "application/pdf", sizeBytes: 42 }],
      },
    });
    const file = new File(["pdf"], "a.pdf", { type: "application/pdf" });

    const assets = await uploadImages([file]);

    const form = mocks.post.mock.calls[0][1] as FormData;
    expect(form.getAll("files")).toEqual([file]);
    expect(form.getAll("images")).toEqual([]);
    expect(assets).toEqual([expect.objectContaining({ assetId: "asset-1" })]);
  });

  it("rejects a legacy response without managed asset IDs", async () => {
    mocks.post.mockResolvedValue({ data: { success: true, urls: ["https://files.test/a.pdf"] } });

    await expect(uploadImages([new File(["pdf"], "a.pdf")])).rejects.toThrow("Invalid upload response");
  });
});
