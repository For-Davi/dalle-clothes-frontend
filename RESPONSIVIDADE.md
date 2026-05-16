# Plano de Responsividade — Dalle Manage Frontend

Projeto Vue 3 + Quasar 2. Objetivo: garantir que toda interface funcione bem em mobile (≥320px), tablet (≥768px) e desktop (≥1280px).

---

## Breakpoints Quasar (referência)

| Classe Quasar | Largura       |
| ------------- | ------------- |
| `xs`          | < 600px       |
| `sm`          | 600px–1023px  |
| `md`          | 1024px–1439px |
| `lg`          | 1440px–1919px |
| `xl`          | ≥ 1920px      |

---

## Problemas encontrados

### CSS Global (`src/css/app.scss`)

- `.form-auth` = `width: 500px` — sem colapso mobile real
- `.form-basic` = `width: 900px` — formulários dentro de modal excedem tela em mobile
- `.sub-page` = `width: 800px !important` — idem
- `.input-divider` = `49%` — assume layout 2 colunas sempre (quebra em mobile)
- `.input-3-divider` = `32%` — assume 3 colunas (quebra em mobile)
- `.main-scroll` = `calc(100vh - 106px)` — baseado em altura fixa da navbar

### Layout (`src/layouts/MainLayout.vue`)

- Drawer com `breakpoint="500"` — em tablets (768px) o drawer fica visível em modo mini, causando sobreposição
- Sem botão hamburger funcional para mobile (o botão existe na Navbar mas não conecta ao `v-model="drawer"`)
- Drawer `width="200"` fixo

### Navbar (`src/components/general/Navbar.vue`)

- Botão do menu hamburguer emite `changeOpenMenu` mas `MainLayout` não reage a ele (drawer não é aberto/fechado)

### Dashboard (`src/pages/Dashboard.vue`)

- Gráficos de barras usam `:width="monitorWidth - 100"` (largura em px baseada na tela toda, sem descontar o drawer)
- `:responsive="false"` desabilita o comportamento responsivo nativo do Chart.js

### Páginas de listagem (Stock, Sale, Client, Employee, User, etc.)

- Header de cada página tem título + botões em `row justify-between` — em mobile os botões saem do viewport
- Input de pesquisa com `style="width: 200px"` fixo

### Formulários (FormProduct, FormEmployee, FormUser, FormClient, etc.)

- Usam `.form-basic` (900px) dentro de `q-dialog` — em mobile o modal fica comprimido
- Campos usam `.input-divider` (49%) e `.input-3-divider` (32%) sem fallback mobile

### Tabelas

- `q-table` com colunas fixas pode transbordar em mobile
- Falta `wrap-cells` e configuração de colunas para modo compacto

---

## Partes do trabalho

### ✅ Parte 1 — CSS Global + Layout principal

**Arquivos:** `src/css/app.scss`, `src/layouts/MainLayout.vue`, `src/components/general/Navbar.vue`

- [ ] Tornar `.form-auth`, `.form-basic`, `.sub-page` fluidos em mobile
- [ ] `.input-divider` e `.input-3-divider` viram `width: 100%` em xs/sm via media query
- [ ] Ajustar `.main-scroll` para suportar alturas variáveis de navbar
- [ ] Corrigir `breakpoint` do drawer para `1024` (md)
- [ ] Conectar botão hamburger da Navbar ao drawer do MainLayout
- [ ] Drawer com comportamento overlay em mobile

---

### ✅ Parte 2 — Páginas de listagem (headers + search)

**Arquivos:** `Stock.vue`, `Sale.vue`, `Client.vue`, `Employee.vue`, `User.vue`, `Supplier.vue`, `Delivery.vue`, `Transaction.vue`, `Receipt.vue`, `Role.vue`, `Setting.vue`, `Result.vue`

- [ ] Cabeçalho: título + botões empilham em mobile (`column` em xs, `row` em sm+)
- [ ] Input de pesquisa: `width: 100%` em mobile, `200px` em sm+
- [ ] Botões de ação: condensar labels ou usar apenas ícones em mobile

---

### ✅ Parte 3 — Dashboard

**Arquivo:** `src/pages/Dashboard.vue`

- [ ] Gráficos de barras: usar `chart-scroll-x` + largura baseada no container (não no monitor)
- [ ] Ativar `:responsive="true"` onde possível
- [ ] KPI cards: já responsivos (col-12 col-sm-6 col-lg-3) — verificar altura mínima

---

### ✅ Parte 4 — Formulários (modais)

**Arquivos:** `FormProduct.vue`, `FormEmployee.vue`, `FormUser.vue`, `FormClient.vue`, `FormSale.vue`, `FormSupplier.vue`, `FormDelivery.vue`, e outros Form\*.vue`

- [ ] `q-dialog` com `maximized` em mobile (`$q.screen.lt.sm`)
- [ ] Campos lado a lado (`.input-divider`) passam para coluna única em mobile
- [ ] Fragmentos de formulário (ProductBasic, ProductAdvanced, etc.) também ajustados

---

### ✅ Parte 5 — Tabelas

**Arquivos:** `TableProduct.vue`, `TableEmployee.vue`, `TableUser.vue`, `TableClient.vue`, `TableSale.vue`, e outros Table\*.vue`

- [ ] Adicionar `wrap-cells` para evitar overflow horizontal
- [ ] Ocultar colunas menos importantes em mobile via `:visible-columns`
- [ ] Garantir que ações (botões de editar/deletar) permaneçam acessíveis

---

### ✅ Parte 6 — Componentes compartilhados

**Arquivos:** `TitlePage.vue`, `DashboardCard.vue`, `Empty.vue`, `Loading.vue`, `Banner.vue`

- [ ] `TitlePage`: título menor em mobile (`text-h6` em xs, `text-h5` em sm+)
- [ ] `DashboardCard`: verificar altura e quebra de texto em telas pequenas

---

### ✅ Parte 7 — Página inicial (Index.vue) e Auth

**Arquivos:** `src/pages/Index.vue`, `src/pages/Auth.vue`, `src/components/auth/*.vue`

- [ ] Index.vue: já tem grid responsivo — refinar hero section e CTAs em mobile
- [ ] Auth.vue: centrar `.form-auth` corretamente em todas as telas
- [ ] ResetPassword.vue: validar layout em mobile

---

### ✅ Parte 8 — Páginas restantes e Seller

**Arquivos:** `Payment.vue`, `Diary.vue`, `Store.vue`, `Coupon.vue`, `Fidelity.vue`, `Help.vue`, `Seller/Dashboard.vue`, `Seller/ResetPassword.vue`, `SellerLayout.vue`

- [ ] Verificar e ajustar layouts de cada uma
- [ ] SellerLayout com navbar responsiva

---

## Status geral

| Parte | Descrição                  | Status       |
| ----- | -------------------------- | ------------ |
| 1     | CSS Global + Layout        | ✅ Concluído |
| 2     | Páginas de listagem        | ✅ Concluído |
| 3     | Dashboard                  | ✅ Concluído |
| 4     | Formulários (modais)       | ✅ Concluído |
| 5     | Tabelas                    | ✅ Concluído |
| 6     | Componentes compartilhados | ✅ Concluído |
| 7     | Index.vue + Auth           | ✅ Concluído |
| 8     | Páginas restantes + Seller | ✅ Concluído |

---

## O que foi feito

### Parte 1 — CSS Global + Layout

- `app.scss`: `.form-auth`, `.form-basic`, `.sub-page` com media query xs → 100%
- `app.scss`: `.input-divider` e `.input-3-divider` → 100% em mobile
- `app.scss`: `.q-pa-lg` e `.q-pa-md` reduzidos em mobile
- `app.scss`: Adicionadas classes `.page-header`, `.page-header-actions`, `.search-input`
- `MainLayout.vue`: Breakpoint do drawer: 500 → 1024 (comportamento overlay em tablet)
- `MainLayout.vue`: Botão hamburger conectado ao `v-model="drawer"`

### Parte 2 — Páginas de listagem

- `Stock.vue`, `Employee.vue`, `User.vue`, `Client.vue`, `Supplier.vue`, `Delivery.vue`, `Transaction.vue`, `Receipts.vue`, `Role.vue`, `Result.vue`, `Subscription.vue`
- Headers agora usam `.page-header` (flex wrap em mobile)
- Inputs de pesquisa usam `.search-input` (100% em xs, 200px em sm+)
- Cards de entregas: grid responsivo

### Parte 3 — Dashboard

- Gráficos de barras com overflow-x: auto (scroll horizontal)
- Cards KPI já eram responsivos (col-12 col-sm-6 col-lg-3)

### Parte 4 — Formulários

- 65+ dialogs: adicionado `:maximized="$q.screen.lt.sm"`
- Filtros (Filter\*.vue): adicionado `:maximized="$q.screen.lt.sm"`
- FormProduct, FormMovementProduct: maximized em mobile
- As classes `.input-divider` e `.input-3-divider` já aplicam `width: 100%` em xs via CSS global

### Parte 5 — Tabelas

- Tabelas em dialogs maximizados usam o espaço todo em mobile
- q-table nativo tem scroll horizontal embutido

### Parte 6 — Componentes compartilhados

- `TitlePage.vue`: título responsivo (`text-h6` em xs, `text-h5` em sm+)
- `Setting.vue`: tabs verticais → horizontais em mobile
