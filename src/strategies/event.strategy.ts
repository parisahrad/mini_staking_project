import { Resource } from 'src/resource/entities/resource.entity';
import { CreateBookingDto } from '../booking/dto/create-booking.dto';
import { BookingStrategy } from './booking-strategy.interface';
import { Result } from 'src/common/type';
import { BookingRepository } from 'src/booking/booking.repository';
import { ResourceRepository } from 'src/resource/resource.repository';
import { Booking } from 'src/booking/entities/booking.entity';
import { Repository } from 'typeorm';
import { BookingStatusEnum } from 'src/booking/booking.type';
import { EventTicketMetadata } from 'src/resource/resource.type';

export class EventBookingStrategy implements BookingStrategy {
  constructor(private readonly bookingRepo: Repository<Booking>) {}

  async validate(
    resource: Resource,
    dto: CreateBookingDto,
  ): Promise<Result<void>> {
    if (new Date(dto.endDate) <= new Date(dto.startDate)) {
      return { error: true, status: 400, messega: 'invalid input' };
    }

    const metadata = resource.metadata as EventTicketMetadata;
    const allBookings = await this.bookingRepo.count({
      where: {
        resource: { id: resource.id },
      },
    });

    if (!allBookings) {
      return {
        error: true,
      };
    }
    // capacity
    if (metadata.capacity <= allBookings) {
      return {
        error: true,
        messega: 'no capacity',
        status: 400,
      };
    }

    //overlap
    const booked = await this.bookingRepo.find({
      where: {
        resource:{ id: resource.id},
        startDate: dto.startDate,
        endDate: dto.endDate,
        status: BookingStatusEnum.CONFIRMED,
      },
    });

    if (booked) {
      return {
        error: true,
        status: 400,
        messega: 'already booked',
      };
    }

    return { error: false, status: 200, messega: 'validate done' };
  }
}
