import { Injectable } from '@nestjs/common';
import { Otp } from 'src/auth/entities/otp.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OtpRepository extends Repository<Otp> {
  constructor(private dataSource: DataSource) {
    super(Otp, dataSource.createEntityManager());
  }
}
