import type { Profile } from "@/types/content";

export const PLASTIC_SURGERY_INTEREST_OPTIONS = [
  "Lipoaspiração",
  "Lipo HD",
  "Abdominoplastia",
  "Mamoplastia",
  "Mastopexia",
  "Rinoplastia",
  "Blefaroplastia",
  "Harmonização facial",
  "Contorno corporal",
  "Outro",
];

type CompletenessProfile = Pick<
  Profile,
  "full_name" | "email" | "phone" | "city" | "avatar_url" | "plastic_surgery_interests"
>;

function isFilled(value: string | null | undefined) {
  return Boolean(value?.trim());
}

export function calculateProfileCompleteness(profile: CompletenessProfile) {
  const checks = [
    {
      key: "full_name",
      label: "Nome completo",
      filled: isFilled(profile.full_name),
    },
    {
      key: "email",
      label: "E-mail",
      filled: isFilled(profile.email),
    },
    {
      key: "phone",
      label: "Telefone",
      filled: isFilled(profile.phone),
    },
    {
      key: "city",
      label: "Cidade",
      filled: isFilled(profile.city),
    },
    {
      key: "avatar_url",
      label: "Foto de perfil",
      filled: isFilled(profile.avatar_url),
    },
    {
      key: "plastic_surgery_interests",
      label: "Cirurgias de interesse",
      filled: (profile.plastic_surgery_interests ?? []).length > 0,
    },
  ] as const;

  const filledCount = checks.filter((check) => check.filled).length;
  const percentage = Math.round((filledCount / checks.length) * 100);
  const missingFields = checks.filter((check) => !check.filled).map((check) => check.label);

  return {
    percentage,
    filledCount,
    totalCount: checks.length,
    missingFields,
    suggestions: missingFields,
  };
}
