import { errors } from "@/shared/lib/errors";
import type { GenerateNewsAiInput } from "./validations";

export interface GenerateNewsAiOutput {
  titleEn: string;
  excerptEn: string;
  bodyEn: string;
  slugEn: string;
}

export async function generateNewsEnglishWithGemini(
  apiKey: string,
  model: string,
  input: GenerateNewsAiInput
): Promise<GenerateNewsAiOutput> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw errors.validation("ไม่พบ Gemini API Key กรุณาระบุในหน้าตั้งค่าองค์กร (/settings)");
  }

  const selectedModel = model.trim() || "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${cleanKey}`;

  const prompt = `You are a professional university public relations journalist and translator.
Translate the following Thai academic and institutional news announcement into high quality, formal English.

Thai News Data:
- Title (TH): ${input.titleTh}
- Excerpt (TH): ${input.excerptTh || "None"}
- Full Body (TH): ${input.bodyTh}

Requirements:
1. "titleEn": A natural, professional, and engaging English headline suitable for a higher education institution.
2. "excerptEn": A concise, clear summary (1-2 sentences) capturing the core essence of the news.
3. "bodyEn": A complete, accurate English translation and article elaboration of the full body. Preserve paragraphs, dates, names, key details, and professional tone.
4. "slugEn": An SEO-friendly URL slug in English (lowercase letters, numbers, and hyphens only, e.g. "faculty-launches-new-curriculum-2026").

Respond strictly in valid JSON matching this exact structure:
{
  "titleEn": "...",
  "excerptEn": "...",
  "bodyEn": "...",
  "slugEn": "..."
}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const errMsg = errJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      if (response.status === 400 || errMsg.toLowerCase().includes("api_key")) {
        throw new Error("Gemini API Key ไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าถึง (Invalid API Key)");
      }
      if (response.status === 429 || errMsg.toLowerCase().includes("quota")) {
        throw new Error("โควตาการเรียกใช้งาน Gemini API เต็มชั่วคราว (Quota Exceeded)");
      }
      throw new Error(`Gemini API Error: ${errMsg}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gemini ไม่ได้ส่งผลลัพธ์กลับมา");
    }

    const parsed = JSON.parse(text) as GenerateNewsAiOutput;
    return {
      titleEn: parsed.titleEn || "",
      excerptEn: parsed.excerptEn || "",
      bodyEn: parsed.bodyEn || "",
      slugEn: parsed.slugEn || "",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw errors.internal(`การสร้างเนื้อหาภาษาอังกฤษด้วย AI ล้มเหลว: ${msg}`);
  }
}
