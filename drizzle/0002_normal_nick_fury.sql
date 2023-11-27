CREATE TABLE IF NOT EXISTS "product_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" serial NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" serial NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_category_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"image" varchar,
	"description" varchar(256) NOT NULL,
	"price" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" serial NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" serial NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_name_idx" ON "product_category" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_name_idx" ON "product" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_product_category_id_product_category_id_fk" FOREIGN KEY ("product_category_id") REFERENCES "product_category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
