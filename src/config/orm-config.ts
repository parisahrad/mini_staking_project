import { Booking } from '../booking/entities/booking.entity';
import { Resource } from '../resource/entities/resource.entity';
import { User } from '../user/entities/user.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  entities: [Resource, Booking, User],
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'booking_db',
  synchronize: true,
});
