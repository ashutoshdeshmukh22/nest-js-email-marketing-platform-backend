import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { SubscriberRepository } from './repositories/subscriber.repository';
import { Request, Response } from 'express';

@Injectable()
export class SubscriberService {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async create(
    ctx: Request,
    res: Response,
    createSubscriberDto: CreateSubscriberDto,
  ) {
    try {
      const newSubscriber = await this.subscriberRepository.createSubscriber(
        createSubscriberDto,
      );

      if (!newSubscriber) {
        throw new Error('Failed to subscribe');
      }

      // Send Welcome Email

      return res.status(201).json({
        message: 'Successfully subscribed',
        subscriber: newSubscriber,
      });
    } catch (error) {
      throw error;
    }
  }

  // Create A Email List
  async createEmailList(
    ctx: Request,
    res: Response,
    subscribers: CreateSubscriberDto[],
  ) {
    try {
      const newSubscribers =
        await this.subscriberRepository.createMultipleSubscribers(subscribers);

      if (!newSubscribers) {
        throw new Error('Failed to Create Email List');
      }

      res.status(201).json({
        message: 'Successfully created email list',
        subscribers: newSubscribers,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(res: Response) {
    try {
      const subscribers = await this.subscriberRepository.getAllSubscribers();

      if (!subscribers) {
        throw new Error('Failed to fetch subscribers');
      }

      return res.status(200).json({
        message: 'Successfully fetched subscribers',
        subscribers: subscribers,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(res: Response, id: string) {
    try {
      const subscriber = await this.subscriberRepository.getById(id);

      if (!subscriber) {
        throw new Error('Subscriber not found');
      }

      return res.status(200).json({
        message: 'Successfully fetched subscriber',
        subscriber: subscriber,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(res: Response, email: string) {
    try {
      const subscriber = await this.subscriberRepository.getByEmail(email);

      if (!subscriber) {
        throw new Error('Subscriber not found');
      }

      return res.status(200).json({
        message: 'Successfully fetched subscriber',
        subscriber: subscriber,
      });
    } catch (error) {
      throw error;
    }
  }

  async update(
    res: Response,
    id: string,
    updateSubscriberDto: UpdateSubscriberDto,
  ) {
    try {
      const subscriber = await this.subscriberRepository.updateSubscriber(
        updateSubscriberDto,
      );

      if (!subscriber) {
        throw new Error('Failed to update subscriber');
      }

      return res.status(200).json({
        message: 'Successfully updated subscriber',
        subscriber: subscriber,
      });
    } catch (error) {
      throw error;
    }
  }

  async unSubscribe(res: Response, email: string) {
    try {
      await this.subscriberRepository.deleteByEmail(email);

      res.status(200).json({
        message: 'Successfully unsubscribed',
      });
    } catch (error) {
      throw new Error('Failed to unsubscribe');
    }
  }
}
