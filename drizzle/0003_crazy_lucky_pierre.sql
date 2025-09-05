CREATE TYPE "public"."contract_status" AS ENUM('draft', 'sent', 'signed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."contract_type" AS ENUM('employment', 'nda', 'service', 'purchase', 'lease', 'other');--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" text PRIMARY KEY NOT NULL,
	"recipient" text NOT NULL,
	"email" text NOT NULL,
	"contract_type" "contract_type" NOT NULL,
	"subject" text NOT NULL,
	"status" "contract_status" DEFAULT 'draft' NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"content" text,
	"envelope_id" text,
	"signed_at" timestamp,
	"expires_at" timestamp,
	"created_by" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_contracts_status" ON "contracts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_contracts_created" ON "contracts" USING btree ("created");--> statement-breakpoint
CREATE INDEX "idx_contracts_email" ON "contracts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_contracts_contract_type" ON "contracts" USING btree ("contract_type");--> statement-breakpoint
CREATE INDEX "idx_contracts_created_by" ON "contracts" USING btree ("created_by");