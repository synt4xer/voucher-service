DROP INDEX IF EXISTS "product_name_idx";--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_name_idx" ON "product" ("name");