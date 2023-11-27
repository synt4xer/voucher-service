ALTER TABLE "users" RENAME TO "user";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_category_id_idx" ON "product_category" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_id_idx" ON "product" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "user" ("id");