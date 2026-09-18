# ObraFácil

SaaS de controle de obras para construtores e empreiteiros. Multi-tenant,
com Supabase (Postgres + Auth + RLS) como backend.

## Rodando localmente

```bash
npm install
cp .env.example .env
npm run dev
```

O `.env.example` já vem com a URL e a chave pública (anon) do projeto Supabase
"Obras" (organização rpconfeccoes, região sa-east-1) — são seguras de expor
no frontend, a segurança real está no RLS do banco.

Acesse `http://localhost:5173`.

## O que já está pronto

- Landing page
- Cadastro / login (Supabase Auth) — ao cadastrar, um trigger no banco cria
  automaticamente o tenant, o profile (role `owner`) e uma subscription em
  `trial`
- Dashboard com indicadores (obras, progresso, financeiro)
- Minhas Obras: criar, editar, arquivar, buscar e filtrar por status
- Página da obra com abas: Visão geral e Financeiro (entradas/despesas)
  funcionando; Progresso, Materiais, Equipe e Documentos com a tabela do
  banco pronta, aguardando a interface

## Banco de dados

Todas as tabelas, RLS e a lógica de multi-tenant já estão aplicadas
diretamente no projeto Supabase "Obras". Não é preciso rodar nenhuma
migration manualmente.

## Próximos passos sugeridos

1. Módulo de materiais (`material_purchases`)
2. Módulo de funcionários, diárias e vales (`employees`,
   `employee_daily_logs`, `employee_advances`, `employee_payments`)
3. Etapas de progresso (`project_stages`)
4. Upload de fotos e documentos via Supabase Storage
5. Integração de pagamento (Stripe/Mercado Pago/Asaas) ligada à tabela
   `subscriptions`
6. Área administrativa do SaaS (visão de todos os tenants, receita etc.)
