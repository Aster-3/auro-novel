import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, "Kullanıcı adı en az 4 karakter olmalıdır")
    .max(15, "Kullanıcı adı en fazla 15 karakter olabilir")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir",
    ),
  nickname: z
    .string()
    .min(4, "Takma ad en az 4 karakter olmalıdır")
    .max(20, "Takma ad en fazla 20 karakter olabilir")
    .regex(
      /^[a-zA-Z0-9_-]+( [a-zA-Z0-9_-]+)*$/,
      "Takma ad harf, rakam, alt çizgi veya tire ile başlamalı/bitmeli ve başında/sonunda boşluk olmamalıdır.",
    ),
  email: z.email("Geçerli bir e-posta adresi giriniz"),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .regex(/[A-Z]/, "Şifre en az bir büyük harf içermelidir")
    .regex(/[0-9]/, "Şifre en az bir rakam içermelidir"),
});

export const loginSchema = z.object({
  email: z.email("Geçersiz e-posta adresi"),
  password: z
    .string("Şifre alanı zorunludur")
    .min(8, "Şifre en az 8 karakter olmalıdır"),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const updateProfileSchema = z.object({
  nickname: z
    .string()
    .min(4, "Takma ad en az 4 karakter olmalıdır")
    .max(20, "Takma ad en fazla 20 karakter olabilir")
    .regex(
      /^[a-zA-Z0-9_-]+( [a-zA-Z0-9_-]+)*$/,
      "Takma ad harf, rakam, alt çizgi veya tire ile başlamalı/bitmeli ve başında/sonunda boşluk olmamalıdır.",
    )
    .optional(),
  profileImageUrl: z.any().optional(),
  profileBackgroundImageUrl: z.any().optional(),
  description: z
    .string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional(),
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
