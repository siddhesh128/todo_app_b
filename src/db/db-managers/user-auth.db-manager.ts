import { PrismaAdapter } from "../mssql/prisma.adapter";
import { UserAttributes } from "../../types/db-types";

export class UserAuthManager {
  private static adapter = PrismaAdapter.getInstance();

  // Find a user by username
  public static async findUserByUsername(username: string): Promise<UserAttributes | null> {
    const userRecord = await this.adapter.findOne('User', { username });
    return userRecord as UserAttributes | null;
  }

  // Create a new user
  public static async createUser(username: string, password: string): Promise<UserAttributes | null> {
    try {
      // Insert new user
      const newUser = await this.adapter.create('User', { username, password });
      return newUser as UserAttributes;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  public static async updateUserVerification(username: string): Promise<void> {
    try {
      await this.adapter.update('User', { verified: true }, { username });
    } catch (error) {
      console.error("Error updating user verification status:", error);
      throw error;
    }
  }

  public static async getAllUsers(): Promise<UserAttributes[]> {
    try {
      const users = await this.adapter.findAll('user', {});
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Error fetching all users");
    }
  }
}