export type Base44Professional = {
  base44_id: string;
  nome: string;
  foto_perfil_url: string;
  especialidades: string;
  descricao_curta: string;
  formacao: string;
  crm: string;
  registro_sbcp: string;
  telefone: string;
  whatsapp: string;
  created_date: string;
  updated_date: string;
};

export type Base44Content = {
  base44_id: string;
  profissional_id: string;
  profissional_nome: string;
  profissional_foto: string;
  imagem_url: string;
  legenda: string;
  created_date: string;
  updated_date: string;
};

export type Base44User = {
  base44_id: string;
  email: string;
  full_name: string;
  role: "admin" | "user";
  premium_status?: "none" | "active" | "expired" | "canceled" | "past_due";
  premium_since?: string;
  premium_until?: string;
  gateway_customer_id?: string;
  created_date: string;
};

export type Base44ContentLike = {
  conteudo_id: string;
  usuario_email: string;
};

export type Base44WhatsAppContact = {
  usuario_email: string;
  profissional_id: string;
  profissional_nome?: string;
  mensagem: string;
  origem: string;
};

export type Base44Subscription = {
  usuario_id: string;
  usuario_email: string;
  gateway?: string;
  gateway_customer_id?: string;
  gateway_subscription_id?: string;
  gateway_payment_id?: string;
  plano?: string;
  status?: "active" | "expired" | "canceled" | "past_due" | "pending";
  valor?: number;
  moeda?: string;
  data_inicio?: string;
  data_fim?: string;
  ultima_confirmacao_pagamento?: string;
};
