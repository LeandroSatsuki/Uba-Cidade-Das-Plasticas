import { EntrarForm } from "@/components/entrar-form";
import { getSafeNextPath } from "@/lib/safe-next";

type EntrarPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getCallbackError(searchParams?: Record<string, string | string[] | undefined>) {
  const error = searchParams?.error;
  const value = Array.isArray(error) ? error[0] : error;

  return value === "auth_callback_failed"
    ? "Não foi possível confirmar seu e-mail. Tente entrar novamente."
    : "";
}

function getNextPath(searchParams?: Record<string, string | string[] | undefined>) {
  const next = searchParams?.next;
  const value = Array.isArray(next) ? next[0] : next;

  return getSafeNextPath(value, "/");
}

export default async function EntrarPage({ searchParams }: EntrarPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <EntrarForm
      callbackErrorMessage={getCallbackError(resolvedSearchParams)}
      nextPath={getNextPath(resolvedSearchParams)}
    />
  );
}
