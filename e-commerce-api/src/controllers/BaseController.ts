import { Request, Response } from "express";
import DatabaseObject from "@models/DatabaseObject";
import { mongoDBClient } from "@config/database";

/**
 * BaseController provides a foundation for all controllers in the application.
 * It includes utility methods to handle common controller logic, such as error handling.
 */
export default abstract class BaseController {
  /**
   * Wraps an asynchronous route handler to handle errors gracefully.
   *
   * This method ensures that any unhandled errors in the provided route handler
   * are caught and a 500 Internal Server Error response is sent to the client.
   *
   * @param fn - The asynchronous route handler function to wrap.
   * @returns A new route handler function with error handling.
   */
  protected handle = (fn: (req: Request, res: Response) => Promise<void>) => {
    return async (req: Request, res: Response) => {
      try {
        await fn(req, res);
      } catch (error) {
        console.error("[Controller error]: ", error);
        res.status(500).json({ error: "Internal Server error" });
      }
    };
  };

  /**
   * Helper function to create and load an instance of a DatabaseObject subclass by its ID.
   *
   * @param id - The object ID as a string.
   * @param Model - The class of the DatabaseObject subclass (e.g., Product, User).
   * @returns A loaded instance of the specified class.
   * @throws Will throw an error if the object cannot be found or loaded.
   */
  protected async createInstance<T extends DatabaseObject>(
    id: string,
    Model: new () => T
  ): Promise<T> {
    const instance = new Model();
    instance.id = mongoDBClient.toObjectId(id);
    await instance.load();
    return instance;
  }
}
