import { UserAuthManager } from "../../db/db-managers/user-auth.db-manager"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { REGISTER_MESSAGES,JWT_SECRET } from "../../constants/auth";
import { UserAttributes } from "../../types/db-types";
import EmailService from "../email.service";

export class UserAuthService {
  private static emailService = new EmailService();

  private static generateVerificationToken(email: string): string {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
  }

  private static async sendVerificationEmail(email: string): Promise<void> {
    const token = this.generateVerificationToken(email);
    const verificationLink = `${process.env.BACKEND_URL || 'http://localhost:5000'}/verify/${token}`;
    
    const subject = "Verify Your Email Address";
    const text = `Please verify your email by clicking: ${verificationLink}`;
    const html = `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
    `;

    await this.emailService.sendEmail(email, subject, text, html);
  }

  public static async login(username: string, password: string): Promise<{ token: string; verified: boolean } | null> {
    const user: UserAttributes | null = await UserAuthManager.findUserByUsername(username);

    if (!user) {
      return null;  // User not found
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, verified: user.verified };
  }

  public static async register(username: string, password: string): Promise<UserAttributes | null> {
    const existingUser = await UserAuthManager.findUserByUsername(username);

    if (existingUser) {
      throw new Error(REGISTER_MESSAGES.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserAuthManager.createUser(username, hashedPassword);
    
    // Send verification email
    await this.sendVerificationEmail(username);
    
    return newUser;
  }

  public static async verifyEmail(token: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
      const user = await UserAuthManager.findUserByUsername(decoded.email);
      
      if (!user) {
        return false;
      }

      // Update user's verified status
      await UserAuthManager.updateUserVerification(decoded.email);
      return true;
    } catch (error) {
      return false;
    }
  }
}

