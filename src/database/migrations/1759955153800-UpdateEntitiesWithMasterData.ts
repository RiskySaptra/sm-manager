import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntitiesWithMasterData1759955153800
  implements MigrationInterface
{
  name = 'UpdateEntitiesWithMasterData1759955153800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add new columns (nullable)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "statusId" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "planTypeId" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_right" ADD "moduleId" character varying(50)`,
    );

    // Step 2: Update new columns with data from old columns
    await queryRunner.query(`UPDATE "user" SET "statusId" = 'ACTIVE'`); // Default for all existing users
    await queryRunner.query(
      `UPDATE "organization" SET "planTypeId" = "planType"::text`,
    );
    await queryRunner.query(
      `UPDATE "access_right" SET "moduleId" = "module"::text`,
    );

    // Step 3: Alter new columns to be NOT NULL and set defaults
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "statusId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "statusId" SET DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "planTypeId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "planTypeId" SET DEFAULT 'FREE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_right" ALTER COLUMN "moduleId" SET NOT NULL`,
    );

    // Step 4: Drop old columns
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "planType"`,
    );
    await queryRunner.query(`ALTER TABLE "access_right" DROP COLUMN "module"`);

    // Step 5: Drop old enum types
    await queryRunner.query(`DROP TYPE "public"."organization_plantype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."access_right_module_enum"`);

    // Step 6: Add foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "master_user_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_f875ca29441bdb3d83c40d6a750" FOREIGN KEY ("planTypeId") REFERENCES "master_plan_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_right" ADD CONSTRAINT "FK_951a22b91d7b686fefc749ffce3" FOREIGN KEY ("moduleId") REFERENCES "master_access_modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse order of UP
    // Step 1: Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE "access_right" DROP CONSTRAINT "FK_951a22b91d7b686fefc749ffce3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_f875ca29441bdb3d83c40d6a750"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );

    // Step 2: Re-create enum types
    await queryRunner.query(
      `CREATE TYPE "public"."access_right_module_enum" AS ENUM('INVENTORY', 'SALES', 'USERS', 'REPORTS', 'SETTINGS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."organization_plantype_enum" AS ENUM('FREE', 'BASIC', 'PREMIUM')`,
    );

    // Step 3: Re-add old columns (nullable)
    await queryRunner.query(
      `ALTER TABLE "access_right" ADD "module" "public"."access_right_module_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "planType" "public"."organization_plantype_enum"`,
    );

    // Step 4: Update old columns with data from new columns
    await queryRunner.query(
      `UPDATE "access_right" SET "module" = "moduleId"::"public"."access_right_module_enum"`,
    );
    await queryRunner.query(
      `UPDATE "organization" SET "planType" = "planTypeId"::"public"."organization_plantype_enum"`,
    );

    // Step 5: Alter old columns to be NOT NULL and set defaults
    await queryRunner.query(
      `ALTER TABLE "access_right" ALTER COLUMN "module" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "planType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "planType" SET DEFAULT 'FREE'`,
    );

    // Step 6: Drop new columns
    await queryRunner.query(
      `ALTER TABLE "access_right" DROP COLUMN "moduleId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "planTypeId"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "statusId"`);
  }
}
