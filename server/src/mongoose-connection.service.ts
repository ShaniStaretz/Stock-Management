import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongooseConnectionService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {
    console.log('MongooseConnectionService loaded');
  }

  onModuleInit() {
    if (this.connection.readyState === 1) {
        console.log('1. MongoDB connected successfully');
    } else {
      this.connection.once('open', () => {
        console.log('2. MongoDB connected successfully');
      });

      this.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });
    }
  }
}
