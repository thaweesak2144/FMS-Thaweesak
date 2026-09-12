"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

// Dynamically import TinyMCE React component with SSR disabled
const TinyEditor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] w-full rounded-md border bg-muted/20 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>กำลังโหลดเครื่องมือจัดรูปแบบข้อความ (Tiny Editor)...</span>
      </div>
    ),
  }
);

export interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  apiKey?: string;
  label?: string;
  error?: string;
  helperText?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  height = 360,
  disabled = false,
  apiKey,
  label,
  error,
  helperText,
}: RichTextEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-muted-foreground block">
            {label}
          </label>
        )}
        <div
          style={{ height: `${height}px` }}
          className="w-full rounded-md border bg-muted/20 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs"
        >
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>กำลังเตรียมระบบแก้ไขข้อความ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 rich-text-editor-container">
      {label && (
        <label className="text-xs font-semibold text-muted-foreground block">
          {label}
        </label>
      )}

      <div className="rounded-md border overflow-hidden bg-background">
        <TinyEditor
          // Use CDN script to bypass Cloud API key requirement and domain restriction banner
          tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.6.0/tinymce.min.js"
          apiKey={apiKey}
          licenseKey="gpl"
          value={value}
          onEditorChange={(content) => onChange(content)}
          disabled={disabled}
          init={{
            height,
            menubar: false,
            branding: false,
            promotion: false,
            statusbar: true,
            placeholder: placeholder || "กรอกเนื้อหาข่าว...",
            skin: isDark ? "oxide-dark" : "oxide",
            content_css: isDark ? "dark" : "default",
            directionality: "ltr",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | " +
              "bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | table link | code fullscreen",
            content_style: `
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Thai", Helvetica, Arial, sans-serif;
                font-size: 14px;
                line-height: 1.65;
                color: ${isDark ? "#f3f4f6" : "#1f2937"};
                background-color: ${isDark ? "#18181b" : "#ffffff"};
                padding: 12px;
              }
              p { margin-bottom: 0.75rem; }
              h1, h2, h3, h4, h5, h6 { font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; }
              ul, ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
              th, td { border: 1px solid ${isDark ? "#3f3f46" : "#e5e7eb"}; padding: 6px 10px; }
              th { background-color: ${isDark ? "#27272a" : "#f9fafb"}; font-weight: 600; }
              a { color: #2563eb; text-decoration: underline; }
            `,
          }}
        />
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
