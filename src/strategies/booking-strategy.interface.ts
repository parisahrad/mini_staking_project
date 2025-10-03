import { Resource } from 'src/resource/entities/resource.entity';
import { CreateBookingDto } from '../booking/dto/create-booking.dto';
import { Result } from 'src/common/type';

export interface BookingStrategy {
  validate(resource: Resource, dto: CreateBookingDto): Promise<Result<void>>;
}
