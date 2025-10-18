import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm'

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

    @Column({
        name: 'last_sign_in_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    lastSignInAt!: Date

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date = new Date()

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date = new Date()
}
