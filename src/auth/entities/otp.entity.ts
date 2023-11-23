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

@Entity('otp')
export class Otp {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: true })
  otp: number;

  @ApiProperty()
  @Column({ name: 'otp_expiration', nullable: true })
  otpExpiration: Date;

  @ApiProperty()
  @Column({ name: 'otp_expires', nullable: false, default: false })
  otpExpires: boolean;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.otp)
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
