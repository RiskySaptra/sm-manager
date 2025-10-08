import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMasterDataTables1759954833623 implements MigrationInterface {
  name = 'CreateMasterDataTables1759954833623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "master_user_statuses" ("id" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_7632fcc80ff7b4d31ae94b1f48d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_plan_types" ("id" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_bd20086fb155711df2f97d88b66" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_audit_actions" ("id" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_c74fcc9ae4cd98ed3011612c3ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_access_modules" ("id" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_d8a368cf52258548a0a8d2b5446" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "master_access_modules"`);
    await queryRunner.query(`DROP TABLE "master_audit_actions"`);
    await queryRunner.query(`DROP TABLE "master_plan_types"`);
    await queryRunner.query(`DROP TABLE "master_user_statuses"`);
  }
}
