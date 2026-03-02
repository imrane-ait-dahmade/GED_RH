import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class UsersService {
  // TODO: Implement with Prisma once the schema is defined
  async create(): Promise<never> {
    throw new NotImplementedException('User creation is not implemented yet.');
  }

  async findAll(): Promise<never> {
    throw new NotImplementedException('User listing is not implemented yet.');
  }
}
