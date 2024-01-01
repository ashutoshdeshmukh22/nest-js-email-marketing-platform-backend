import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Subscriber } from '../entities/subscriber.entity';
import { UpdateSubscriberDto } from '../dto/update-subscriber.dto';
import { CreateSubscriberDto } from '../dto/create-subscriber.dto';

@Injectable()
export class SubscriberRepository extends Repository<Subscriber> {
  constructor(private dataSource: DataSource) {
    super(Subscriber, dataSource.createEntityManager());
  }

  async getById(id: string): Promise<Subscriber> {
    return await this.findOne({ where: { id } });
  }

  async getByEmail(email: string): Promise<Subscriber> {
    return await this.findOne({ where: { email } });
  }

  async createSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber> {
    return await this.save(subscriber);
  }

  async updateSubscriber(subscriber: UpdateSubscriberDto): Promise<Subscriber> {
    return await this.save(subscriber);
  }

  async deleteSubscriber(id: string): Promise<void> {
    await this.delete(id);
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.delete({ email });
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return await this.find();
  }

  async getSubscriberCount(): Promise<number> {
    return await this.count();
  }

  async createMultipleSubscribers(
    subscribers: CreateSubscriberDto[],
  ): Promise<Subscriber[]> {
    return await this.save(subscribers);
  }
}
