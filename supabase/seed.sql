insert into public.professionals (
  base44_id,
  nome,
  foto_perfil_url,
  especialidades,
  descricao_curta,
  formacao,
  crm,
  registro_sbcp,
  telefone,
  whatsapp,
  ativo,
  created_at,
  updated_at
)
values
  (
    '69ed780d1e469cc0c04b388b',
    'Dra. Camila Souza',
    'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=400&h=400&fit=crop&crop=face',
    'Blefaroplastia, Lifting Facial, Preenchimento',
    'Cirurgiã plástica com atuação focada em rejuvenescimento facial. Resultados sutis e elegantes.',
    'Medicina - UFV | Residência em Cirurgia Plástica - UFMG | Especialização em Cirurgia Estética Facial',
    'CRM/MG 11223',
    'SBCP 5566',
    '(32) 3531-9012',
    '32999012345',
    true,
    '2026-04-26T02:27:25.264000',
    '2026-04-26T02:27:25.264000'
  ),
  (
    '69ed780d1e469cc0c04b388a',
    'Dr. Ricardo Mendes',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    'Mamoplastia, Lipoaspiração, Abdominoplastia',
    'Referência em cirurgia corporal em Ubá. Técnicas avançadas com foco em segurança e resultado natural.',
    'Medicina - UFMG | Residência em Cirurgia Plástica - Santa Casa de SP | Fellow em Body Contouring - EUA',
    'CRM/MG 67890',
    'SBCP 4321',
    '(32) 3531-5678',
    '32995678901',
    true,
    '2026-04-26T02:27:25.264000',
    '2026-04-26T02:27:25.264000'
  ),
  (
    '69ed780d1e469cc0c04b3889',
    'Dra. Thais Souza',
    'https://base44.app/api/apps/69ed774a1dcbd8c2befbcfc9/files/mp/public/69ed774a1dcbd8c2befbcfc9/b31516820_Perfil.png',
    'Contorno Corporal, Mastopexia em L, Argoplasma, Lipo Ultrassônica',
    'Milhares de vidas esculpidas!\nCIRURGIA GERAL - RQE Nº: 38322\nCIRURGIA PLÁSTICA - RQE Nº: 38323.',
    'Universidade Federal de Juiz de Fora - Campus Juiz de Fora, em 2011.',
    'CRM/MG 55066',
    'SBCP',
    '',
    '32 98833-6590',
    true,
    '2026-04-26T02:27:25.264000',
    '2026-05-02T22:25:37.047000'
  )
on conflict (base44_id) do update set
  nome = excluded.nome,
  foto_perfil_url = excluded.foto_perfil_url,
  especialidades = excluded.especialidades,
  descricao_curta = excluded.descricao_curta,
  formacao = excluded.formacao,
  crm = excluded.crm,
  registro_sbcp = excluded.registro_sbcp,
  telefone = excluded.telefone,
  whatsapp = excluded.whatsapp,
  ativo = excluded.ativo,
  updated_at = excluded.updated_at;

insert into public.contents (
  base44_id,
  professional_id,
  author_id,
  imagem_url,
  legenda,
  is_premium,
  ativo,
  created_at,
  updated_at
)
select
  '69ed781b1e469cc0c04b388f',
  professionals.id,
  null,
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=800&fit=crop',
  'Blefaroplastia: o procedimento que rejuvenesce o olhar. Saiba quando é indicado e o que esperar do resultado.',
  false,
  true,
  '2026-04-26T02:27:39.995000',
  '2026-04-26T02:27:39.995000'
from public.professionals
where professionals.base44_id = '69ed780d1e469cc0c04b388b'
on conflict (base44_id) do update set
  professional_id = excluded.professional_id,
  author_id = excluded.author_id,
  imagem_url = excluded.imagem_url,
  legenda = excluded.legenda,
  is_premium = excluded.is_premium,
  ativo = excluded.ativo,
  updated_at = excluded.updated_at;

insert into public.contents (
  base44_id,
  professional_id,
  author_id,
  imagem_url,
  legenda,
  is_premium,
  ativo,
  created_at,
  updated_at
)
select
  '69ed781b1e469cc0c04b388e',
  professionals.id,
  null,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=800&fit=crop',
  'Lipoaspiração com técnica HD: resultados mais definidos com menor tempo de recuperação. Agende sua consulta.',
  false,
  true,
  '2026-04-26T02:27:39.995000',
  '2026-04-26T02:27:39.995000'
from public.professionals
where professionals.base44_id = '69ed780d1e469cc0c04b388a'
on conflict (base44_id) do update set
  professional_id = excluded.professional_id,
  author_id = excluded.author_id,
  imagem_url = excluded.imagem_url,
  legenda = excluded.legenda,
  is_premium = excluded.is_premium,
  ativo = excluded.ativo,
  updated_at = excluded.updated_at;

insert into public.contents (
  base44_id,
  professional_id,
  author_id,
  imagem_url,
  legenda,
  is_premium,
  ativo,
  created_at,
  updated_at
)
select
  '69ed781b1e469cc0c04b388d',
  professionals.id,
  null,
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=800&fit=crop',
  'A rinoplastia é um dos procedimentos mais procurados. Conheça os cuidados essenciais no pós-operatório para garantir o melhor resultado.',
  false,
  true,
  '2026-04-26T02:27:39.995000',
  '2026-05-02T22:40:44.183000'
from public.professionals
where professionals.base44_id = '69ed780d1e469cc0c04b3889'
on conflict (base44_id) do update set
  professional_id = excluded.professional_id,
  author_id = excluded.author_id,
  imagem_url = excluded.imagem_url,
  legenda = excluded.legenda,
  is_premium = excluded.is_premium,
  ativo = excluded.ativo,
  updated_at = excluded.updated_at;

insert into public.contents (
  base44_id,
  professional_id,
  author_id,
  imagem_url,
  legenda,
  is_premium,
  ativo,
  created_at,
  updated_at
)
select
  '69ed781b1e469cc0c04b3890',
  professionals.id,
  null,
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=800&fit=crop',
  'Harmonização facial: técnicas minimamente invasivas para um resultado natural e harmônico.',
  false,
  true,
  '2026-04-26T02:27:39.995000',
  '2026-05-02T22:40:44.183000'
from public.professionals
where professionals.base44_id = '69ed780d1e469cc0c04b3889'
on conflict (base44_id) do update set
  professional_id = excluded.professional_id,
  author_id = excluded.author_id,
  imagem_url = excluded.imagem_url,
  legenda = excluded.legenda,
  is_premium = excluded.is_premium,
  ativo = excluded.ativo,
  updated_at = excluded.updated_at;

insert into public.contents (
  base44_id,
  professional_id,
  author_id,
  imagem_url,
  legenda,
  is_premium,
  ativo,
  created_at,
  updated_at
)
select
  '69f6812371394389cebf0ff3',
  professionals.id,
  null,
  'https://base44.app/api/apps/69ed774a1dcbd8c2befbcfc9/files/mp/public/69ed774a1dcbd8c2befbcfc9/9c79c98cf_LipoDefinio.png',
  'A lipo de alta definição não é para todas as pessoas!\nE essa é uma informação que precisa ser dita com responsabilidade.\nA lipo HD não cria músculos, não substitui hábitos e não é solução universal.\nEla é indicada para casos específicos, quando há perfil corporal adequado, leitura correta da anatomia e objetivos realistas.\nIndicar bem é parte essencial do resultado.\nCada decisão cirúrgica deve respeitar o corpo, o histórico e a individualidade de cada paciente.\nA consulta é o primeiro passo para decisões seguras e bem conduzidas!\n',
  false,
  true,
  '2026-05-02T22:56:35.320000',
  '2026-05-02T22:56:35.320000'
from public.professionals
where professionals.base44_id = '69ed780d1e469cc0c04b3889'
on conflict (base44_id) do update set
  professional_id = excluded.professional_id,
  author_id = excluded.author_id,
  imagem_url = excluded.imagem_url,
  legenda = excluded.legenda,
  is_premium = excluded.is_premium,
  ativo = excluded.ativo,
  updated_at = excluded.updated_at;
