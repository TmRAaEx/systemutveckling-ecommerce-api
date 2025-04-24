import { MongoClient, Db, Collection, Filter, WithId, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

/**
 * A wrapper class for managing a MongoDB connection using the native MongoDB driver.
 */
class MongoDBClient {
  private client: MongoClient;
  private db?: Db;
  private isConnected = false;

  /**
   * Creates an instance of MongoDBClient.
   *
   * @param uri - The MongoDB connection URI.
   * @param dbName - The name of the database to connect to.
   */
  constructor(private uri: string, private dbName: string) {
    this.client = new MongoClient(uri);
  }

  /**
   * Establishes a connection to the MongoDB database if not already connected.
   *
   * If a connection is already active, this method does nothing.
   * This should be called before performing any database operations.
   *
   * @throws {Error} If the connection attempt fails.
   */
  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.isConnected = true;
        console.log(`[database]: ✅ Connected to MongoDB: ${this.dbName}`);
      } catch (error) {
        console.error(
          `[database error]: Error connecting to MongoDB: ${error}`
        );
        throw new Error("Failed to connect to MongoDB.");
      }
    }
  }

  /**
   * Returns the active database instance.
   *
   * @returns The connected `Db` instance.
   * @throws {Error} If the database is not connected.
   */
  public getDB(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  /**
   * Retrieves a specific collection from the connected database.
   * Ensures a connection is established before accessing the collection.
   *
   * @param name - The name of the collection to retrieve.
   * @returns The MongoDB `Collection` instance.
   * @throws {Error} If the database connection fails.
   */
  public async getCollection<T extends Document = Document>(
    name: string
  ): Promise<Collection<T>> {
    await this.connect();
    return this.getDB().collection<T>(name);
  }

  /**
   * Finds all documents in a collection matching the provided filter.
   *
   * @param collectionName - The name of the collection to query.
   * @param filter - An optional MongoDB filter object for the query.
   * @returns An array of documents typed as T.
   */
  public async findAll<T extends Document = Document>(
    collectionName: string,
    filter: Filter<T> = {}
  ): Promise<WithId<T>[]> {
    const collection = await this.getCollection<T>(collectionName);
    return collection.find(filter).toArray();
  }

  /**
   * Helper function to convert a string to a MongoDB ObjectId.
   *
   * This function takes a string representation of an ObjectId and converts it to
   * an actual MongoDB ObjectId instance that can be used in queries.
   *
   * @param stringId - The string representation of the ObjectId (e.g., "605c72ef153207d4d8b0d1b6").
   * @returns The corresponding MongoDB ObjectId instance.
   * @throws {Error} If the provided string is not a valid ObjectId.
   */
  public toObjectId(stringId: string): ObjectId {
    if (!ObjectId.isValid(stringId)) {
      throw new Error(`[database error]: Invalid ObjectId string: ${stringId}`);
    }
    return new ObjectId(stringId);
  }

  /**
   * Closes the active MongoDB connection, if connected.
   */
  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log(`[database]: 🔌 Disconnected from MongoDB`);
    }
  }
}

const mongoUri = process.env.MONGO_URI || "";
const dbName = process.env.MONGO_DB || "";

/**
 * Shared singleton instance of MongoDBClient used across the application.
 */
export const mongoDBClient = new MongoDBClient(mongoUri, dbName);
