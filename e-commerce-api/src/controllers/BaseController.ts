import { Request, Response } from "express";

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
}
