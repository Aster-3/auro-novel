import * as z from "zod";

import { wordCounter } from "@/utils/wordCounter";

export const updateCreateChapterSchema = z.object({
  content: z
    .string()
    .max(50000, "Bölüm içeriği çok uzun (maks. 50.000 karakter).")
    .optional()
    .superRefine((val, ctx) => {
      if (!val) return;
      const count = wordCounter(val);
      if (count < 20) {
        ctx.addIssue({
          code: "custom",
          message: "Bölüm içeriği en az 20 kelime olmalıdır.",
        });
      }

      if (count > 4000) {
        ctx.addIssue({
          code: "custom",
          message: "Bölüm içeriği en fazla 4000 kelime olabilir.",
        });
      }
    }),
  title: z
    .string()
    .min(1, "Başlık boş olamaz.")
    .max(200, "Başlık en fazla 200 karakter olabilir.")
    .optional(),
});
