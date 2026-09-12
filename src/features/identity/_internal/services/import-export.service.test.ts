import { describe, it, expect } from "vitest";
import { parseCsv, generateUserCsvTemplate } from "./import-export.service";

describe("import-export.service", () => {
  describe("parseCsv", () => {
    it("parses simple CSV lines", () => {
      const csv = "email,name,roleCode\ntest@example.com,Test User,ADMIN";
      const rows = parseCsv(csv);
      expect(rows).toEqual([
        ["email", "name", "roleCode"],
        ["test@example.com", "Test User", "ADMIN"],
      ]);
    });

    it("handles quotes and commas inside quoted strings", () => {
      const csv = 'email,name,roleCode\nuser@example.com,"Somchai, Jr.",MEMBER';
      const rows = parseCsv(csv);
      expect(rows).toEqual([
        ["email", "name", "roleCode"],
        ["user@example.com", "Somchai, Jr.", "MEMBER"],
      ]);
    });

    it("strips UTF-8 BOM", () => {
      const csv = "\uFEFFemail,name\nuser@example.com,Somchai";
      const rows = parseCsv(csv);
      expect(rows[0][0]).toBe("email");
    });
  });

  describe("generateUserCsvTemplate", () => {
    it("generates a template with UTF-8 BOM and correct headers", () => {
      const template = generateUserCsvTemplate();
      expect(template.startsWith("\uFEFF")).toBe(true);
      expect(template).toContain("email,name,roleCode,password,status");
    });
  });
});
