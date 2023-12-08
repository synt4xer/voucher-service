CREATE TABLE IF NOT EXISTS "payment_method" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_code" varchar(25) NOT NULL,
	"payment_name" varchar(25) NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_type" varchar(25) NOT NULL,
	"node_id" integer NOT NULL,
	"key" varchar(50) NOT NULL,
	"operator_fn" varchar(20) NOT NULL,
	"type" varchar(20) NOT NULL,
	"value" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"shipment_code" varchar(100) NOT NULL,
	"shipment_name" varchar(100) NOT NULL,
	"shipment_amount" numeric NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "voucher" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"effect" varchar(25) NOT NULL,
	"active_from" timestamp NOT NULL,
	"active_to" timestamp NOT NULL,
	"quota" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"value" numeric NOT NULL,
	"max_value" numeric NOT NULL,
	"tnc" varchar NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "payment_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "payment_meta" json;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_method_id_idx" ON "payment_method" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "payment_method_code_idx" ON "payment_method" ("payment_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rule_id_idx" ON "rules" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_id_idx" ON "shipment" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "shipment_code_idx" ON "shipment" ("shipment_code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "shipment_name_idx" ON "shipment" ("shipment_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "voucher_id_idx" ON "voucher" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "code_idx" ON "voucher" ("code");