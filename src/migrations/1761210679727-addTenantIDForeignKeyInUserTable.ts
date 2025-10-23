import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTenantIDForeignKeyInUserTable1761210679727
    implements MigrationInterface
{
    name = 'AddTenantIDForeignKeyInUserTable1761210679727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "tenant_id" integer NOT NULL`,
        )
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"`,
        )
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenant_id"`)
    }
}
