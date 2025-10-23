import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', length: 100, nullable: false })
    name!: string

    @Column({ type: 'varchar', length: 100, nullable: false })
    domain!: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    address!: string

    @Column({ type: 'varchar', length: 20, nullable: false })
    phone!: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date = new Date()

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date = new Date()
}
