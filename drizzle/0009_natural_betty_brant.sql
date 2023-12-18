ALTER TABLE "order"
ALTER COLUMN
    "order_number" TYPE uuid USING order_number:: uuid;

--> statement-breakpoint

ALTER TABLE "order"
ALTER COLUMN "order_number"
SET DEFAULT gen_random_uuid();

--> statement-breakpoint

ALTER TABLE "order"
ADD
    COLUMN "shipment_discount" numeric DEFAULT '0' NOT NULL;

--> statement-breakpoint

ALTER TABLE "inventory" DROP COLUMN IF EXISTS "qty_on_hand";