"use server";

import { runAction, type ActionResult } from "@/shared/lib/result";
import { P } from "../../permissions";
import { requirePermission } from "../rbac";
import * as svc from "../services/import-export.service";

const actorOf = (ctx: {
  tenantId: string;
  userId: string;
  isSuperAdmin: boolean;
  permissions: string[];
}) => ({
  tenantId: ctx.tenantId,
  actorId: ctx.userId,
  isSuperAdmin: ctx.isSuperAdmin,
  permissions: ctx.permissions,
});

export async function exportUsersCsvAction(
  options: svc.ExportUsersOptions = {}
): Promise<ActionResult<{ csv: string; filename: string }>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.usersRead);
    const csv = await svc.exportUsersToCsv(ctx.tenantId, options);
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `users-export-${dateStr}.csv`;
    return { csv, filename };
  });
}

export async function getUsersCsvTemplateAction(): Promise<
  ActionResult<{ csv: string; filename: string }>
> {
  return runAction(async () => {
    await requirePermission(P.usersManage);
    const csv = svc.generateUserCsvTemplate();
    return { csv, filename: "users-import-template.csv" };
  });
}

export async function validateUsersCsvAction(
  csvText: string
): Promise<ActionResult<svc.CsvValidationResult>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.usersManage);
    return svc.validateUsersCsv(ctx.tenantId, csvText, ctx);
  });
}

export async function batchImportUsersAction(input: {
  users: svc.ValidImportUser[];
  defaultPassword?: string;
}): Promise<ActionResult<{ count: number }>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.usersManage);
    return svc.batchImportUsers(
      ctx.tenantId,
      actorOf(ctx),
      input.users,
      input.defaultPassword
    );
  });
}
