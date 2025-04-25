import { myCollections } from "@config/database";
import DatabaseObject from "./DatabaseObject";
import bcrypt from "bcrypt";

/**
 * Represents a user in the e-commerce system.
 */
export default class User extends DatabaseObject {
  public username: string = "";
  public email: string = "";
  public passwordHash: string = "";
  public admin: boolean = false;

  constructor() {
    super();
  }

  /**
   * Retrieves the name of the database collection for users.
   * @returns {myCollections["collectionName"]} The name of the collection ("users").
   */
  public getCollection(): myCollections["collectionName"] {
    return "users";
  }

  /**
   * Hashes the user's password and stores the hash.
   * @param unhashedPassword - The plain-text password to hash.
   */
  public async hashPassword(unhashedPassword: string): Promise<void> {
    const saltRounds = 10;
    this.passwordHash = await bcrypt.hash(unhashedPassword, saltRounds);
  }

  /**
   * Verifies a plain-text password against the stored hash.
   * @param unhashedPassword - The plain-text password to verify.
   * @returns {Promise<boolean>} True if the password matches, false otherwise.
   */
  public async verifyPassword(unhashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(unhashedPassword, this.passwordHash);
  }

  /**
   * Maps database data to the user instance.
   * @param data The raw database document.
   */
  public setupFromDatabase(data: Record<string, any>): void {
    this.username = data.username;
    this.email = data.email;
  }
}
