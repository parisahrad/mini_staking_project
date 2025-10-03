import { ResourceTypeEnum } from 'src/resource/resource.type';
import { BookingStrategy } from './booking-strategy.interface';
import { EventBookingStrategy } from './event.strategy';
import { BookingRepository } from 'src/booking/booking.repository';
import { Repository } from 'typeorm';
import { Booking } from 'src/booking/entities/booking.entity';

type supportedResource = ResourceTypeEnum.Event;
export class StrategyFactory {
  private startegies: Record<supportedResource, BookingStrategy>;

  constructor(private readonly bookingRepo: Repository<Booking>) {
    this.startegies = {
      [ResourceTypeEnum.Event]: new EventBookingStrategy(this.bookingRepo),
    };
  }

  get(type: string): BookingStrategy {
    return this.startegies[type];
  }
}
