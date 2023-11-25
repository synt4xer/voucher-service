CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"date_of_birth" date NOT NULL,
	"password" varchar(256) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" serial NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" serial NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "users" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");