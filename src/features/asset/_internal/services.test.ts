import { describe, it, expect, vi, beforeEach } from "vitest";
import { transferAsset } from "./services";
import { prisma } from "@/shared/lib/infra/prisma";

// Mock prisma
vi.mock("@/shared/lib/infra/prisma", () => ({
  prisma: {
    asset: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    assetTransfer: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("transferAsset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCtx = {
    tenantId: "tenant-1",
    userId: "user-1",
    userName: "Test",
    email: "test@test.com",
    locale: "th" as const,
    roles: [],
  };

  it("should successfully transfer asset and create history record", async () => {
    const mockAsset = {
      id: "123e4567-e89b-42d3-a456-426614174001",
      locationId: "loc-1",
      custodianId: "cust-1",
      tenantId: "tenant-1"
    };

    (prisma.asset.findUnique as any).mockResolvedValue(mockAsset);
    (prisma.$transaction as any).mockResolvedValue([{ id: "123e4567-e89b-42d3-a456-426614174001", locationId: "123e4567-e89b-42d3-a456-426614174002" }]);

    const result = await transferAsset(mockCtx, {
      assetId: "123e4567-e89b-42d3-a456-426614174001",
      toLocationId: "123e4567-e89b-42d3-a456-426614174002",
      toCustodianId: "123e4567-e89b-42d3-a456-426614174003",
      reason: "Move to new office",
    });

    expect(prisma.asset.findUnique).toHaveBeenCalledWith({
      where: { id: "123e4567-e89b-42d3-a456-426614174001", tenantId: "tenant-1" },
    });
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result.locationId).toBe("123e4567-e89b-42d3-a456-426614174002");
  });

  it("should throw error if asset not found", async () => {
    (prisma.asset.findUnique as any).mockResolvedValue(null);

    await expect(transferAsset(mockCtx, {
      assetId: "123e4567-e89b-42d3-a456-426614174404",
      toLocationId: "123e4567-e89b-42d3-a456-426614174002",
      toCustodianId: "123e4567-e89b-42d3-a456-426614174003",
      reason: "Test",
    })).rejects.toThrow("Asset not found");
  });
});
