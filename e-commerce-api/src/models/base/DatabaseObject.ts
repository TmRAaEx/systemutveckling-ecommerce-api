import { mongoDBClient, myCollections } from "@config/database";
import { Filter, ObjectId, OptionalUnlessRequiredId } from "mongodb";

export default class DatabaseObject {
  public id: ObjectId | null = null;
  public collection: myCollections["collectionName"] | null = null;

  /**
   * Retrieves the name of the database collection.
   * This method should be overridden by subclasses to specify their collection name.
   * @returns {myCollections["collectionName"] | null} The name of the collection.
   */
  public getCollection(): myCollections["collectionName"] | null {
    console.warn(
      "[databaseObject]: method getCollection should be overridden by child class",
      this
    );
    return null;
  }

  /**
   * Hook for subclasses to customize how data is mapped from the database.
   * This method should be overridden by subclasses.
   * @param data The raw database document.
   */
  public setupFromDatabase(data: Record<string, any>): void {
    console.warn(
      "[databaseObject]: setupFromDatabase should be overridden by child class",
      this
    );
  }

  /**
   * Loads data from the database and populates the instance.
   */
  public async load(): Promise<void> {
    const collectionName = this.getCollection();
    if (!collectionName || !this.id) {
      console.warn(
        "[databaseObject]: No collection name or id provided.",
        this
      );
      return; // Exit early if collection name or id is null
    }

    try {
      const results = await mongoDBClient.findAll(collectionName, {
        _id: this.id,
      });
      if (results.length > 0) {
        this.setupFromDatabase(results[0]); // Use the hook for customization
      } else {
        console.warn("[databaseObject]: No document found with the given ID.");
      }
    } catch (error) {
      console.error("[databaseObject]: Error loading document:", error);
    }
  }

  /**
   * Retrieves all documents from the collection and returns instances of the subclass.
   */
  static async getAll<T extends DatabaseObject>(
    this: new () => T,
    filter: Filter<T> = {}
  ): Promise<T[]> {
    const instance = new this(); // Create an instance of the subclass
    const collectionName = instance.getCollection();

    if (!collectionName) {
      throw new Error(
        `[databaseObject]: Collection name must be defined in the subclass.${instance}`
      );
    }

    const items = await mongoDBClient.findAll(collectionName, filter);

    const results = items.map((data) => {
      const obj = new this(); // Create a new instance of the subclass
      obj.id = data._id;
      obj.setupFromDatabase(data); // Use the hook for customization
      return obj;
    });

    return results;
  }

  /**
   * Will run automatically when data is sent as JSON.
   * Removes internal properties like @property collection
   */
  public toJSON() {
    const { id, collection, ...otherData } = this;

    if (id) {
      return { ...otherData, _id: id }; // Map `id` to `_id`
    }
    return otherData; // Exclude `id` if it's null
  }

  /**
   * Saves the current instance to the database.
   * If the instance has an `id`, it updates the existing document.
   * Otherwise, it adds a new document to the collection.
   */
  public async save(): Promise<void> {
    const collectionName = this.getCollection();
    if (!collectionName) {
      throw new Error("[databaseObject]: Collection name must be defined.");
    }

    const data = this.toJSON(); // Serialize the object to exclude internal properties

    if (this.id) {
      // -----Update existing document-----
      await mongoDBClient.update(
        collectionName,
        { _id: this.id } as Filter<DatabaseObject>,
        data
      );
    } else {
      // -----Add new document-----
      const result = await mongoDBClient.add(
        collectionName,
        data as OptionalUnlessRequiredId<this>
      );
      this.id = result.insertedId; // Set the new ID
    }
  }
  /**
   * Deletes the current object from the database
   */
  public async delete() {
    const collection = this.getCollection();
    if (!collection) {
      throw new Error("[databaseObject]: Collection name must be defined.");
    }

    if (!this.id) {
      throw new Error("[databaseObject]: id is required");
    }

    await mongoDBClient.deleteById(collection, this.id);
  }
}
