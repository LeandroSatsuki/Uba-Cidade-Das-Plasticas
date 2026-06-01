import { EntrarForm } from "@/components/entrar-form";

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

export default async function EntrarPage({ searchParams }: EntrarPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <EntrarForm callbackErrorMessage={getCallbackError(resolvedSearchParams)} />
  );
}
