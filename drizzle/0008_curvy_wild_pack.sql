CREATE TABLE IF NOT EXISTS "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"state" varchar DEFAULT 'open' NOT NULL,
	"data" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "voucher" ALTER COLUMN "code" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shipment_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address" varchar NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_id_idx" ON "session" ("id");