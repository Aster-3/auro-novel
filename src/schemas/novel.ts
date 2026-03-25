import * as z from "zod";

export const createNovelSchemaStepOne = z.object({
  title: z
    .string()
    .min(4, "Roman başlığı en az 4 karakter olmalıdır")
    .max(100, "Roman başlığı en fazla 100 karakter olabilir")
    .refine(
      (val) => val.trim() === val,
      "Başlığın başında veya sonunda boşluk olamaz",
    )
    .refine(
      (val) => !/\s{2,}/.test(val),
      "Kelimeler arasında birden fazla boşluk olamaz",
    )
    .refine(
      (val) => /^[a-zA-Z0-9ĞÜŞİÖÇğüşıöç\s:-]+$/.test(val),
      "Sadece harf, rakam, tire, boşluk ve iki nokta kullanabilirsiniz.",
    )
    .refine(
      (val) => !val.endsWith(":") && !val.endsWith(": "),
      "Başlık iki nokta veya boşlukla bitemez, devamında bir karakter gelmelidir",
    )
    .optional(),
  slug: z
    .string()
    .min(4, "Slug en az 4 karakter olmalıdır")
    .max(150, "Slug en fazla 150 karakter olabilir")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug sadece küçük harf, rakam ve tekli tire (-) içerebilir (tire ile başlayamaz veya bitemez)",
    )
    .optional(),
});
