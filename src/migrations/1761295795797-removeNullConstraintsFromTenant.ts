import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveNullConstraintsFromTenant1761295795797
    implements MigrationInterface
{
    name = 'RemoveNullConstraintsFromTenant1761295795797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tenants" ALTER COLUMN "domain" DROP NOT NULL`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tenants" ALTER COLUMN "domain" SET NOT NULL`,
        )
    }
}
