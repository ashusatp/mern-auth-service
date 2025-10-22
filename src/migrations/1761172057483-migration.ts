import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1761172057483 implements MigrationInterface {
    name = 'Migration1761172057483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(255), "email" character varying(255) NOT NULL, "password" character varying(255), "google_id" character varying(255), "role" character varying(255) NOT NULL DEFAULT 'customer', "last_sign_in_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`,
        )
        await queryRunner.query(`DROP TABLE "refresh_tokens"`)
        await queryRunner.query(`DROP TABLE "users"`)
    }
}
