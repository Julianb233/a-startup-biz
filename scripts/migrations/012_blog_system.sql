-- Blog System tables
-- Created: 2025-12-29

-- ============================================================================
-- BLOG POSTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    author_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    published_at TIMESTAMP WITH TIME ZONE,
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- BLOG CATEGORIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- BLOG POST CATEGORIES JUNCTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_post_categories (
    id SERIAL PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, category_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON blog_posts(status, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Blog categories indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON blog_categories(name);

-- Junction table indexes
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_post ON blog_post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_category ON blog_post_categories(category_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
-- Anyone can view published posts
CREATE POLICY "Anyone can view published posts"
ON blog_posts FOR SELECT
USING (status = 'published' AND published_at <= NOW());

-- Admins can view all posts (including drafts)
CREATE POLICY "Admins can view all blog posts"
ON blog_posts FOR SELECT
USING (is_admin());

-- Admins can create posts
CREATE POLICY "Admins can create blog posts"
ON blog_posts FOR INSERT
WITH CHECK (is_admin());

-- Admins can update posts
CREATE POLICY "Admins can update blog posts"
ON blog_posts FOR UPDATE
USING (is_admin());

-- Admins can delete posts
CREATE POLICY "Admins can delete blog posts"
ON blog_posts FOR DELETE
USING (is_admin());

-- Blog categories policies
-- Anyone can view categories
CREATE POLICY "Anyone can view blog categories"
ON blog_categories FOR SELECT
USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage blog categories"
ON blog_categories FOR ALL
USING (is_admin());

-- Blog post categories junction policies
-- Anyone can view post-category relationships for published posts
CREATE POLICY "Anyone can view post categories for published posts"
ON blog_post_categories FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM blog_posts
        WHERE blog_posts.id = post_id
        AND blog_posts.status = 'published'
        AND blog_posts.published_at <= NOW()
    )
);

-- Admins can view all post-category relationships
CREATE POLICY "Admins can view all post categories"
ON blog_post_categories FOR SELECT
USING (is_admin());

-- Admins can manage post-category relationships
CREATE POLICY "Admins can manage post categories"
ON blog_post_categories FOR ALL
USING (is_admin());

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================

-- Trigger function for blog_posts updated_at
CREATE OR REPLACE FUNCTION update_blog_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at_trigger
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_post_updated_at();

-- Trigger function for blog_categories updated_at
CREATE OR REPLACE FUNCTION update_blog_category_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_categories_updated_at_trigger
    BEFORE UPDATE ON blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_category_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE blog_posts IS 'Blog posts for the website';
COMMENT ON TABLE blog_categories IS 'Categories for organizing blog posts';
COMMENT ON TABLE blog_post_categories IS 'Junction table linking posts to categories';

COMMENT ON COLUMN blog_posts.slug IS 'URL-friendly unique identifier for the post';
COMMENT ON COLUMN blog_posts.status IS 'Post status: draft, published, or scheduled';
COMMENT ON COLUMN blog_posts.published_at IS 'When the post was/will be published';
COMMENT ON COLUMN blog_posts.tags IS 'Array of tags for the post';
COMMENT ON COLUMN blog_posts.meta_title IS 'SEO title (falls back to title if empty)';
COMMENT ON COLUMN blog_posts.meta_description IS 'SEO description (falls back to excerpt if empty)';
