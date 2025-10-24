import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveNullConstraintsFromUserTable1761295404173
    implements MigrationInterface
{
    name = 'RemoveNullConstraintsFromUserTable1761295404173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"`,
        )
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "tenant_id" DROP NOT NULL`,
        )
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"`,
        )
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "tenant_id" SET NOT NULL`,
        )
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }
}
