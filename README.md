# Irmandade do Santíssimo — Web

Aplicativo web da Irmandade do Santíssimo: escalas de serviço, confirmação de presença e avisos.

Documentação completa e roadmap: [docs/ESPECIFICACAO.md](../docs/ESPECIFICACAO.md).

## Tecnologias

- React (Vite)
- Supabase (Auth + PostgreSQL)
- React Router

## Requisitos

- Node.js 18+

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` com as credenciais do Supabase (veja `.env.example`):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Pré-visualização do build |
| `npm run lint` | Lint (oxlint) |
| `npm test` | Executar testes (Vitest) |
| `npm run test:watch` | Testes em modo observação |

## Estrutura

```
web/
├── public/
└── src/
    ├── components/   Componentes reutilizáveis
    ├── screens/      Telas do aplicativo
    ├── navigation/   Rotas e proteção de acesso
    ├── services/     Comunicação com o Supabase
    ├── types/        Tipos/contratos
    ├── data/         Dados locais e constantes
    ├── utils/        Utilitários
    ├── config/       Configurações (tema)
    └── test/         Configuração de testes
```

## Deploy

O build de produção é gerado em `dist/`. Configurações de deploy para Vercel e Netlify estão incluídas.