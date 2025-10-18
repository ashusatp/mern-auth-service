import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn, // Add this import
} from 'typeorm'

import { User } from './User'

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'timestamp', nullable: false })
    expiresAt!: Date

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date = new Date()

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date = new Date()

    @ManyToOne(() => User, (user: User) => user.id, {
        nullable: false,
    })
    @JoinColumn({ name: 'user_id' }) // Use @JoinColumn instead
    user!: User
}
