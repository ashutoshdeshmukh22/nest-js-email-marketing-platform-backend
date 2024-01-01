import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

export class Subscriber {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: true, name: 'first_name' })
  firstName: string;

  @ApiProperty()
  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @ApiProperty()
  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  country: string;
}
