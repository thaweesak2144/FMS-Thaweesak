import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitPetition } from "./services";
import { prisma } from "@/shared/lib/infra/prisma";

vi.mock("@/shared/lib/infra/prisma", () => ({
  prisma: {
    petitionType: {
      findUnique: vi.fn(),
    },
    petition: {
      count: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("submitPetition", () => {
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
    permissions: [],
    isSuperAdmin: false,
    mustChangePassword: false,
  };

  it("should generate correct petition number and save successfully", async () => {
    vi.mocked(prisma.petitionType.findUnique).mockResolvedValue({ id: "123e4567-e89b-42d3-a456-426614174004", slaDays: 3 } as never);
    vi.mocked(prisma.petition.count).mockResolvedValue(5);
    vi.mocked(prisma.petition.create).mockResolvedValue({ id: "pet-1", petitionNumber: "PET-202609-0006" } as never);

    // Mock Date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-11T00:00:00Z"));

    const result = await submitPetition(mockCtx, {
      petitionTypeId: "123e4567-e89b-42d3-a456-426614174004",
      studentIdCard: "123e4567-e89b-42d3-a456-426614174005",
      studentName: "John Doe",
      formData: { reason: "Sick leave" },
    });

    expect(prisma.petitionType.findUnique).toHaveBeenCalled();
    expect(prisma.petition.count).toHaveBeenCalled();
    expect(prisma.petition.create).toHaveBeenCalled();
    
    const createCalls = vi.mocked(prisma.petition.create).mock.calls;
    expect((createCalls[0][0] as { data: { petitionNumber: string } }).data.petitionNumber).toBe("PET-202609-0006");
    expect(result.id).toBe("pet-1");

    vi.useRealTimers();
  });
});
