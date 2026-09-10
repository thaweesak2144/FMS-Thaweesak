import type { Dictionary } from "@/shared/lib/i18n/translate";
import { MESSAGES as core } from "./messages/core";
import { MESSAGES as identity } from "@/features/identity/messages";
import { MESSAGES as sample } from "@/features/sample/messages";
import { MESSAGES as personnel } from "@/features/personnel/messages";
import { MESSAGES as news } from "@/features/news/messages";
import { MESSAGES as curriculum } from "@/features/curriculum/messages";
import { MESSAGES as document } from "@/features/document/messages";
import { MESSAGES as admission } from "@/features/admission/messages";
import { MESSAGES as research } from "@/features/research/messages";
import { MESSAGES as petition } from "@/features/petition/messages";
import { MESSAGES as asset } from "@/features/asset/messages";

/** พจนานุกรม UI ทั้งระบบ — feature ใหม่เพิ่มบรรทัด import ที่นี่ · key ต้องไม่ซ้ำข้าม feature */
export const UI_MESSAGES: Dictionary = { ...core, ...identity, ...sample, ...personnel, ...news, ...curriculum, ...document, ...admission, ...research, ...petition, ...asset };
