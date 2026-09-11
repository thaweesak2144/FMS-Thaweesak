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
  };

  it("should generate correct petition number and save successfully", async () => {
    (prisma.petitionType.findUnique as any).mockResolvedValue({ id: "123e4567-e89b-42d3-a456-426614174004", slaDays: 3 });
    (prisma.petition.count as any).mockResolvedValue(5);
    (prisma.petition.create as any).mockResolvedValue({ id: "pet-1", petitionNumber: "PET-202609-0006" });

    // Mock Date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-11T00:00:00Z"));

    const result = await submitPetition(mockCtx, {
      petitionTypeId: "123e4567-e89b-42d3-a456-426614174004",
      studentId: "123e4567-e89b-42d3-a456-426614174005",
      studentName: "John Doe",
      formData: { reason: "Sick leave" },
    });

    expect(prisma.petitionType.findUnique).toHaveBeenCalled();
    expect(prisma.petition.count).toHaveBeenCalled();
    expect(prisma.petition.create).toHaveBeenCalled();
    
    const createCall = (prisma.petition.create as any).mock.calls[0][0];
    expect(createCall.data.petitionNumber).toBe("PET-202609-0006");
    expect(result.id).toBe("pet-1");

    vi.useRealTimers();
  });
});
