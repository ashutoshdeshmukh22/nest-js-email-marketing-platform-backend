import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('password_reset')
export class PasswordReset {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: true, name: 'reset_token' })
  resetToken: string;

  @ApiProperty()
  @Column({ name: 'reset_token_expiration', nullable: true })
  resetTokenExpiration: Date;

  @ApiProperty()
  @Column({ name: 'reset_token_expires', nullable: false, default: false })
  resetTokenExpires: boolean;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.resetPassToken)
  user: User;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @Column('uuid', { name: 'created_by', nullable: true, default: null })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column('uuid', { name: 'updated_by', nullable: true, default: null })
  updatedBy: string;
}
