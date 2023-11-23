import { Injectable } from '@nestjs/common';
import { PasswordReset } from 'src/auth/entities/passwordreset.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PassResetRepository extends Repository<PasswordReset> {
  constructor(private dataSource: DataSource) {
    super(PasswordReset, dataSource.createEntityManager());
  }
}
