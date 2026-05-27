-- ============================================================
-- Supabase Setup for DataFusion Invoice Generator
-- Run this once in your Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Business info stored as JSONB in profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_info JSONB;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Invoices table (replaces saved_invoices localStorage)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  invoice_number TEXT NOT NULL,
  issue_date DATE,
  due_date DATE,
  client_name TEXT NOT NULL DEFAULT '',
  grand_total NUMERIC(12, 2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Invoices RLS policies — users only see their own invoices
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  USING (auth.uid() = user_id);

-- Line items stored as JSONB array
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS line_items JSONB;

-- Unique invoice number per user
ALTER TABLE invoices ADD CONSTRAINT unique_invoice_number_per_user UNIQUE (user_id, invoice_number);

-- 3. Invoice drafts table (replaces invoice_drafts localStorage)
CREATE TABLE IF NOT EXISTS invoice_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invoice_drafts ENABLE ROW LEVEL SECURITY;

-- Drafts RLS policies — users only see their own drafts
CREATE POLICY "Users can view own drafts"
  ON invoice_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON invoice_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON invoice_drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON invoice_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Line item descriptions table — stores unique descriptions per user for autocomplete
CREATE TABLE IF NOT EXISTS line_item_descriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, LOWER(description))
);

ALTER TABLE line_item_descriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own descriptions"
  ON line_item_descriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own descriptions"
  ON line_item_descriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own descriptions"
  ON line_item_descriptions FOR DELETE
  USING (auth.uid() = user_id);
