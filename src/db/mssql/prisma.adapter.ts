import { PrismaClient } from '@prisma/client';

export class PrismaAdapter {
  private static _instance: PrismaAdapter;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): PrismaAdapter {
    if (!PrismaAdapter._instance) {
      PrismaAdapter._instance = new PrismaAdapter();
    }
    return PrismaAdapter._instance;
  }

  private getModel(model: string) {
    const modelName = model.toLowerCase();
    if (!(modelName in this.prisma)) {
      throw new Error(`Model ${model} not found in Prisma client`);
    }
    return this.prisma[modelName as keyof PrismaClient] as any;
  }

  public async create(model: string, values: object): Promise<any> {
    try {
      return await this.getModel(model).create({ data: values });
    } catch (error) {
      console.error(`Error creating ${model}:`, error);
      throw error;
    }
  }

  public async findOne(model: string, where: object): Promise<any | null> {
    try {
      return await this.getModel(model).findFirst({ where });
    } catch (error) {
      console.error(`Error finding ${model}:`, error);
      throw error;
    }
  }

  public async findAll(model: string, where: object): Promise<any[]> {
    try {
      return await this.getModel(model).findMany({ where });
    } catch (error) {
      console.error(`Error finding all ${model}:`, error);
      throw error;
    }
  }

  public async update(model: string, data: object, where: object): Promise<any> {
    try {
      return await this.getModel(model).update({ where, data });
    } catch (error) {
      console.error(`Error updating ${model}:`, error);
      throw error;
    }
  }

  public async destroy(model: string, where: object): Promise<any> {
    try {
      return await this.getModel(model).delete({ where });
    } catch (error) {
      console.error(`Error deleting ${model}:`, error);
      throw error;
    }
  }
}