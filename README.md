# DataFusion Invoice Generator

A modern, responsive invoice generator built with React, Vite, and Tailwind CSS. Create professional invoices with live preview, draft management, and PDF export — all from the browser.

## Features

- **Live Preview** — See your invoice update in real time as you fill out the form
- **Draft Management** — Save and load multiple invoice drafts (persisted in localStorage)
- **PDF Export** — Generate downloadable PDF invoices with one click
- **Responsive Design** — Works on desktop, tablet, and mobile with a toggle between edit and preview modes
- **Demo Authentication** — Login system ready for Supabase integration

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | React 18                            |
| Build Tool   | Vite                                |
| Styling      | Tailwind CSS                        |
| Dates        | dayjs                               |
| PDF Export   | html2canvas + jsPDF                 |
| Auth (demo)  | Custom context with localStorage    |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd datafusion-invoice

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

## Demo Login

Before Supabase integration, a demo authentication system is in place. Use these credentials to sign in:

| Field    | Value               |
| -------- | ------------------- |
| Email    | `demo@datafusion.com` |
| Password | `password123`       |

The session persists across page reloads via localStorage. Click **Logout** in the header to clear it.

## Project Structure

```
src/
├── App.jsx                          # Root component + auth wrapping
├── index.css                        # Global styles (Tailwind)
├── main.jsx                         # Entry point
│
├── assets/                          # Static images
│
├── components/
│   ├── Auth/
│   │   ├── LoginPage.jsx            # Login form with demo credentials
│   │   └── ProtectedRoute.jsx       # Route guard for unauthenticated users
│   ├── InvoiceForm/
│   │   ├── BusinessDetails.jsx      # Business info fields
│   │   ├── ClientDetails.jsx        # Client info fields
│   │   ├── LineItems.jsx            # Dynamic line item table
│   │   └── TaxDiscount.jsx          # Tax & discount controls
│   ├── InvoicePreview/
│   │   └── InvoicePreview.jsx       # Live invoice preview panel
│   ├── PDFGenerator/                # (future) PDF generation components
│   └── UI/
│       ├── Button.jsx               # Reusable button component
│       ├── Input.jsx                # Reusable input + label component
│       └── Modal.jsx                # Reusable modal dialog
│
├── contexts/
│   ├── AuthContext.jsx              # Authentication state (demo → Supabase)
│   └── InvoiceContext.jsx           # Invoice form state via useReducer
│
├── hooks/
│   ├── useInvoice.js                # Computed invoice values hook
│   └── useLocalStorage.js           # localStorage persistence hook
│
├── templates/
│   └── invoice.jsx                  # Invoice layout template
│
└── utils/
    ├── calculations.js              # Financial calculation helpers
    ├── invoiceNumber.js             # Auto-generate invoice numbers
    └── pdfExport.jsx                # PDF export via html2canvas + jsPDF
```

## Supabase Integration (Planned)

The authentication layer is structured for a smooth migration to Supabase:

1. Install the Supabase client: `npm install @supabase/supabase-js`
2. Create a `.env.local` file with your project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Replace the demo logic in [`src/contexts/AuthContext.jsx`](src/contexts/AuthContext.jsx) — see the `TODO` comments inside `login()` and `logout()`.

### Planned Database Schema

The following schema is expected when the app migrates from demo auth + localStorage to Supabase. It covers authentication, business profiles, clients, invoices with line items, and saved drafts.

#### Entity Relationship Overview

```
profiles 1──N businesses ──┐
                          ├──> invoices N──1 invoice_line_items
clients 1─────────────────┘
invoices 1──N invoice_drafts
```

#### Tables

**`profiles`** — Extended user data (backed by Supabase Auth `auth.users`).

| Column       | Type         | Constraints                        |
| ------------ | ------------ | ---------------------------------- |
| id           | uuid         | PK, references auth.users          |
| name         | text         | NOT NULL                           |
| email        | text         | UNIQUE, NOT NULL                   |
| created_at   | timestamptz  | DEFAULT now()                      |

**`businesses`** — The user's business details (company info shown on invoices).

| Column       | Type         | Constraints                        |
| ------------ | ------------ | ---------------------------------- |
| id           | uuid         | PK, default gen_random_uuid()      |
| user_id      | uuid         | FK → profiles(id), ON DELETE CASCADE |
| name         | text         | NOT NULL                           |
| email        | text         |                                    |
| phone        | text         |                                    |
| address      | text         |                                    |
| city         | text         |                                    |
| state        | text         |                                    |
| postal_code  | text         |                                    |
| country      | text         | DEFAULT 'South Africa'             |
| logo_url     | text         |                                    |
| created_at   | timestamptz  | DEFAULT now()                      |
| updated_at   | timestamptz  | DEFAULT now()                      |

**`clients`** — Stored client records for quick reuse.

| Column       | Type         | Constraints                        |
| ------------ | ------------ | ---------------------------------- |
| id           | uuid         | PK, default gen_random_uuid()      |
| user_id      | uuid         | FK → profiles(id), ON DELETE CASCADE |
| name         | text         | NOT NULL                           |
| email        | text         |                                    |
| phone        | text         |                                    |
| address      | text         |                                    |
| city         | text         |                                    |
| state        | text         |                                    |
| postal_code  | text         |                                    |
| country      | text         | DEFAULT 'South Africa'             |
| created_at   | timestamptz  | DEFAULT now()                      |

**`invoices`** — The main invoice table.

| Column        | Type         | Constraints                        |
| ------------- | ------------ | ---------------------------------- |
| id            | uuid         | PK, default gen_random_uuid()      |
| user_id       | uuid         | FK → profiles(id), ON DELETE CASCADE |
| business_id   | uuid         | FK → businesses(id)                |
| client_id     | uuid         | FK → clients(id)                   |
| invoice_number| text         | NOT NULL                           |
| issue_date    | date         | DEFAULT CURRENT_DATE               |
| due_date      | date         |                                    |
| notes         | text         |                                    |
| payment_terms | text         |                                    |
| tax_rate      | numeric(5,2) | DEFAULT 0                          |
| discount_rate | numeric(5,2) | DEFAULT 0                          |
| subtotal      | numeric(12,2)| NOT NULL                           |
| total         | numeric(12,2)| NOT NULL                           |
| status        | text         | DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue')) |
| created_at    | timestamptz  | DEFAULT now()                      |
| updated_at    | timestamptz  | DEFAULT now()                      |

**`invoice_line_items`** — Individual line items for each invoice.

| Column       | Type         | Constraints                        |
| ------------ | ------------ | ---------------------------------- |
| id           | uuid         | PK, default gen_random_uuid()      |
| invoice_id   | uuid         | FK → invoices(id), ON DELETE CASCADE |
| description  | text         | NOT NULL                           |
| quantity     | numeric(10,2)| DEFAULT 1                          |
| unit_price   | numeric(12,2)| NOT NULL                           |
| line_total   | numeric(12,2)| NOT NULL                           |
| sort_order   | integer      | DEFAULT 0                          |

**`invoice_drafts`** — Saved drafts (JSON snapshot for quick restore).

| Column       | Type         | Constraints                        |
| ------------ | ------------ | ---------------------------------- |
| id           | uuid         | PK, default gen_random_uuid()      |
| user_id      | uuid         | FK → profiles(id), ON DELETE CASCADE |
| name         | text         | NOT NULL                           |
| data         | jsonb        | NOT NULL                           |
| created_at   | timestamptz  | DEFAULT now()                      |
| updated_at   | timestamptz  | DEFAULT now()                      |

#### Full SQL DDL

```sql
-- ── Profiles (extends Supabase auth.users) ──────────────────────
create table profiles (
  id          uuid references auth.users on delete cascade primary key,
  name        text not null,
  email       text unique not null,
  created_at  timestamptz default now()
);

-- ── Businesses ──────────────────────────────────────────────────
create table businesses (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade not null,
  name        text not null,
  email       text,
  phone       text,
  address     text,
  city        text,
  state       text,
  postal_code text,
  country     text default 'South Africa',
  logo_url    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Clients ─────────────────────────────────────────────────────
create table clients (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade not null,
  name        text not null,
  email       text,
  phone       text,
  address     text,
  city        text,
  state       text,
  postal_code text,
  country     text default 'South Africa',
  created_at  timestamptz default now()
);

-- ── Invoices ────────────────────────────────────────────────────
create table invoices (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references profiles(id) on delete cascade not null,
  business_id    uuid references businesses(id),
  client_id      uuid references clients(id),
  invoice_number text not null,
  issue_date     date default current_date,
  due_date       date,
  notes          text,
  payment_terms  text,
  tax_rate       numeric(5,2) default 0,
  discount_rate  numeric(5,2) default 0,
  subtotal       numeric(12,2) not null,
  total          numeric(12,2) not null,
  status         text default 'draft' check (status in ('draft','sent','paid','overdue')),
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── Invoice Line Items ──────────────────────────────────────────
create table invoice_line_items (
  id          uuid default gen_random_uuid() primary key,
  invoice_id  uuid references invoices(id) on delete cascade not null,
  description text not null,
  quantity    numeric(10,2) default 1,
  unit_price  numeric(12,2) not null,
  line_total  numeric(12,2) not null,
  sort_order  integer default 0
);

-- ── Invoice Drafts (JSON snapshots) ─────────────────────────────
create table invoice_drafts (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references profiles(id) on delete cascade not null,
  name       text not null,
  data       jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Row-Level Security ──────────────────────────────────────────
alter table profiles enable row level security;
alter table businesses enable row level security;
alter table clients enable row level security;
alter table invoices enable row level security;
alter table invoice_line_items enable row level security;
alter table invoice_drafts enable row level security;

-- Profiles: users can read/write their own profile only
create policy "Users view own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Businesses: full CRUD for owner
create policy "Owner manages businesses" on businesses for all using (auth.uid() = user_id);

-- Clients: full CRUD for owner
create policy "Owner manages clients" on clients for all using (auth.uid() = user_id);

-- Invoices: full CRUD for owner
create policy "Owner manages invoices" on invoices for all using (auth.uid() = user_id);

-- Line items: full CRUD when the parent invoice belongs to the owner
create policy "Owner manages line items" on invoice_line_items for all
  using (invoice_id in (select id from invoices where user_id = auth.uid()));

-- Drafts: full CRUD for owner
create policy "Owner manages drafts" on invoice_drafts for all using (auth.uid() = user_id);

-- ── Indexes ─────────────────────────────────────────────────────
create index idx_invoices_user_id on invoices(user_id, status);
create index idx_invoices_number  on invoices(invoice_number);
create index idx_line_items_invoice on invoice_line_items(invoice_id);
create index idx_drafts_user_id   on invoice_drafts(user_id);
```

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build for production         |
| `npm run preview` | Preview the production build |
| `npm run lint`  | Run ESLint                   |

## License

MIT
