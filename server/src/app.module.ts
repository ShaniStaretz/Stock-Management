import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { PortfolioModule } from './portfolio/portfolio.module';
import { StocksModule } from './stocks/stocks.module';
import { MongooseConnectionService } from './mongoose-connection.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import appConfig from './common/config/app.config';
import { validationSchema } from './common/config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    HttpModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.MONGO_URI || 'mongodb://localhost:27017/stock-management',
      }),
    }),
    PortfolioModule,
    StocksModule,
    AuthModule,
    UsersModule,
  ],
  providers: [MongooseConnectionService],
})
export class AppModule {}
