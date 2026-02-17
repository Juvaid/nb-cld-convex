-- Nature's Boon Platform — Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up the database.

-- Site-wide settings & theme
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'Nature''s Boon',
  tagline TEXT DEFAULT 'Your Global Partner in Personal Care Excellence',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#16a34a',
  secondary_color TEXT DEFAULT '#064e3b',
  accent_color TEXT DEFAULT '#2bee6c',
  font_family TEXT DEFAULT 'Inter',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Navigation links
CREATE TABLE IF NOT EXISTS nav_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true
);

-- Page content blocks
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  body TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  slug TEXT UNIQUE,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true
);

-- Product categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  image_url TEXT,
  usp TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT,
  author_role TEXT,
  content TEXT,
  rating INT DEFAULT 5,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

-- Stats / accomplishments
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Contact inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Theme export snapshots
CREATE TABLE IF NOT EXISTS theme_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_name TEXT,
  theme_data JSONB,
  content_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_exports ENABLE ROW LEVEL SECURITY;

-- Public read access policies (anyone can read public content)
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read nav_links" ON nav_links FOR SELECT USING (true);
CREATE POLICY "Public read content_blocks" ON content_blocks FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);

-- Public insert for inquiries (contact form)
CREATE POLICY "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Authenticated users can manage everything
CREATE POLICY "Auth manage site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage nav_links" ON nav_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage content_blocks" ON content_blocks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage product_categories" ON product_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage stats" ON stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage theme_exports" ON theme_exports FOR ALL USING (auth.role() = 'authenticated');

-- Insert default site settings
INSERT INTO site_settings (site_name, tagline, primary_color, secondary_color, accent_color, font_family)
VALUES ('Nature''s Boon', 'Your Global Partner in Personal Care Excellence', '#16a34a', '#064e3b', '#2bee6c', 'Inter')
ON CONFLICT DO NOTHING;
