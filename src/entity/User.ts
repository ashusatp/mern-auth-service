import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'

import { Tenant } from './Tenant'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    password?: string

    @Column({
        name: 'google_id',
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: true,
    })
    googleId?: string

    @Column({ type: 'varchar', length: 255, default: 'customer' })
    role!: string

    @Column({
        name: 'last_sign_in_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    last_sign_in_at!: Date

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date = new Date()

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date = new Date()

    @ManyToOne(() => Tenant, (tenant: Tenant) => tenant.id, {
        nullable: false,
    })
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant
}
