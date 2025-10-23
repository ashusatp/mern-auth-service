import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTenantTable1761210364881 implements MigrationInterface {
    name = 'CreateTenantTable1761210364881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenants" (
            "id" SERIAL NOT NULL, 
            "name" character varying(100) NOT NULL, 
            "domain" character varying(100) NOT NULL, 
            "address" character varying(255) NOT NULL, 
            "phone" character varying(20) NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id")
        )`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenants"`)
    }
}
