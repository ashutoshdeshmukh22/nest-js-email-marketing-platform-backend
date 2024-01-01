import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Otp } from 'src/auth/entities/otp.entity';
import { PasswordReset } from 'src/auth/entities/passwordreset.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ nullable: true, name: 'first_name' })
  firstName: string;

  @ApiProperty()
  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @ApiProperty()
  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @ApiProperty()
  @Column({ default: null })
  role: string;

  @ApiProperty()
  @Column({ nullable: true, name: 'is_active', default: false })
  isActive: boolean;

  @ApiProperty()
  @Column({ nullable: true, name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @OneToMany(() => Otp, (otp) => otp.user)
  otp: Otp[];

  @ApiProperty()
  @OneToMany(() => PasswordReset, (token) => token.user)
  resetPassToken: PasswordReset[];

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @Column('uuid', { name: 'created_by', nullable: true, default: null })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column('uuid', { name: 'updated_by', nullable: true, default: null })
  updatedBy: string;

  @ApiProperty()
  @Column({ name: 'password_changed_at', nullable: true })
  passwordChangedAt: number;
}
