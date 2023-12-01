DROP INDEX IF EXISTS "category_name_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "category_name_idx" ON "product_category" ("name");