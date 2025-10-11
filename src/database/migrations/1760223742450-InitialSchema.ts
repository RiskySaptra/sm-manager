import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1760223742450 implements MigrationInterface {
    name = 'InitialSchema1760223742450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "master_plan_types" ("id" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_bd20086fb155711df2f97d88b66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master_access_modules" ("id" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_d8a368cf52258548a0a8d2b5446" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "access_right" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid NOT NULL, "moduleId" character varying(50) NOT NULL, "canRead" boolean NOT NULL DEFAULT true, "canWrite" boolean NOT NULL DEFAULT false, "canDelete" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, CONSTRAINT "PK_f7546dadb2695255e11d29b22ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "name" character varying(255) NOT NULL, "location" character varying(255), "timezone" character varying(50) NOT NULL DEFAULT 'UTC', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "ownerId" uuid NOT NULL, "planTypeId" character varying(50) NOT NULL DEFAULT 'FREE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "storeId" uuid NOT NULL, "userId" uuid NOT NULL, "roleId" uuid NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'ACTIVE', "lastLogin" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_b93269ca4d9016837d22ab6e1e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master_user_statuses" ("id" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_7632fcc80ff7b4d31ae94b1f48d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "passwordHash" text NOT NULL, "name" character varying(100) NOT NULL, "isSuperAdmin" boolean NOT NULL DEFAULT false, "statusId" character varying(50) NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master_audit_actions" ("id" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_c74fcc9ae4cd98ed3011612c3ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "storeId" uuid NOT NULL, "userId" uuid NOT NULL, "actionId" character varying(50) NOT NULL, "targetTable" character varying(100) NOT NULL, "targetId" character varying(100), "description" text, "ipAddress" character varying(50), "userAgent" text, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "changes" jsonb, CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "access_right" ADD CONSTRAINT "FK_b6a1db3afb2c7838e756f114f49" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access_right" ADD CONSTRAINT "FK_951a22b91d7b686fefc749ffce3" FOREIGN KEY ("moduleId") REFERENCES "master_access_modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_2bcd50772082305f3bcee6b6da4" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "FK_131cfaf1fa490aa45d17ea9d0f6" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_67c515257c7a4bc221bb1857a39" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_f875ca29441bdb3d83c40d6a750" FOREIGN KEY ("planTypeId") REFERENCES "master_plan_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_user" ADD CONSTRAINT "FK_63562fe364ecc738a7be56a8444" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_user" ADD CONSTRAINT "FK_a78cdb366cf1bbcaf584a48a7e5" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_user" ADD CONSTRAINT "FK_29586d245154770441881d8f4fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_user" ADD CONSTRAINT "FK_a4b2a3d752ecb729980e5dd5945" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "master_user_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_36279d1f26f4a280fa4fa4eb3af" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_0cd772ccf5e17f911bf17f9602d" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_2621409ebc295c5da7ff3e41396" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_8cd6d966370f7ef4be33d6162ae" FOREIGN KEY ("actionId") REFERENCES "master_audit_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_8cd6d966370f7ef4be33d6162ae"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_2621409ebc295c5da7ff3e41396"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_0cd772ccf5e17f911bf17f9602d"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_36279d1f26f4a280fa4fa4eb3af"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`);
        await queryRunner.query(`ALTER TABLE "organization_user" DROP CONSTRAINT "FK_a4b2a3d752ecb729980e5dd5945"`);
        await queryRunner.query(`ALTER TABLE "organization_user" DROP CONSTRAINT "FK_29586d245154770441881d8f4fd"`);
        await queryRunner.query(`ALTER TABLE "organization_user" DROP CONSTRAINT "FK_a78cdb366cf1bbcaf584a48a7e5"`);
        await queryRunner.query(`ALTER TABLE "organization_user" DROP CONSTRAINT "FK_63562fe364ecc738a7be56a8444"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_f875ca29441bdb3d83c40d6a750"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_67c515257c7a4bc221bb1857a39"`);
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_131cfaf1fa490aa45d17ea9d0f6"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_2bcd50772082305f3bcee6b6da4"`);
        await queryRunner.query(`ALTER TABLE "access_right" DROP CONSTRAINT "FK_951a22b91d7b686fefc749ffce3"`);
        await queryRunner.query(`ALTER TABLE "access_right" DROP CONSTRAINT "FK_b6a1db3afb2c7838e756f114f49"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
        await queryRunner.query(`DROP TABLE "master_audit_actions"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "master_user_statuses"`);
        await queryRunner.query(`DROP TABLE "organization_user"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "store"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "access_right"`);
        await queryRunner.query(`DROP TABLE "master_access_modules"`);
        await queryRunner.query(`DROP TABLE "master_plan_types"`);
    }

}
