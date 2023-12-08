CREATE TABLE IF NOT EXISTS "inventory_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"inventory_id" integer NOT NULL,
	"order_detail_id" integer NOT NULL,
	"order_meta" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"qty_avail" integer DEFAULT 0 NOT NULL,
	"qty_on_hand" integer DEFAULT 0 NOT NULL,
	"qty_settled" integer DEFAULT 0 NOT NULL,
	"qty_total" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"qty" integer NOT NULL,
	"price" numeric NOT NULL,
	"total" numeric NOT NULL,
	"product_meta" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"order_number" varchar(16) NOT NULL,
	"status" varchar(15) DEFAULT 'CREATED' NOT NULL,
	"total" numeric NOT NULL,
	"discount_amount" numeric DEFAULT '0' NOT NULL,
	"shipment_amount" numeric DEFAULT '0' NOT NULL,
	"grand_total" numeric DEFAULT '0' NOT NULL,
	"shipment_meta" json,
	"voucher_meta" json
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventory_detail_id_idx" ON "inventory_detail" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventory_id_idx" ON "inventory" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_detail_id_idx" ON "order_detail" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_id_idx" ON "order" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "order_number_idx" ON "order" ("order_number");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory_detail" ADD CONSTRAINT "inventory_detail_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory_detail" ADD CONSTRAINT "inventory_detail_order_detail_id_order_detail_id_fk" FOREIGN KEY ("order_detail_id") REFERENCES "order_detail"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
