import Product from "@models/Product";
import { ObjectId } from "mongodb";
import { mongoDBClient } from "@config/database"; // Ensure you import your database client

async function testSaveNewProduct() {
  const product = new Product();
  product.name = "Tablet";
  product.price = 500;
  product.image = "tablet.jpg";
  product.description = "A lightweight and portable tablet.";

  await product.save(); // Adds a new document to the "products" collection
  console.log("New Product ID:", product.id); // Should log the new ObjectId
}

async function testSaveExistingProduct() {
  const product = new Product();
  product.id = new ObjectId("680a405c9d388a4716a9aadb"); // Use an existing ID from the database
  await product.load(); // Load the existing product

  console.log("Before Update:", product);

  product.price = 1300; // Update the price
  product.description = "An updated description for the laptop.";
  await product.save(); // Updates the document in the "products" collection

  console.log("After Update:", product);
}

async function testLoadProduct() {
  const product = new Product();
  product.id = new ObjectId("680a405c9d388a4716a9aadb"); // Use an existing ID from the database
  await product.load(); // Load the product data

  console.log("Loaded Product:", product); // Should log the product details
}

async function testGetAllProducts() {
  const products = await Product.getAll(); // Fetch all products from the "products" collection

  console.log("All Products:");
  products.forEach((product) => {
    console.log(
      product.name,
      product.price,
      product.image,
      product.description
    );
  });
}

async function runTests() {
  try {
    console.log("Testing save (add new product)...");
    await testSaveNewProduct();

    console.log("\nTesting save (update existing product)...");
    await testSaveExistingProduct();

    console.log("\nTesting load...");
    await testLoadProduct();

    console.log("\nTesting getAll...");
    await testGetAllProducts();
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    console.log("Closing database connection...");
    await mongoDBClient.disconnect(); // Gracefully close the database connection
    console.log("Tests completed.");
    process.exit(0); // Exit the process gracefully
  }
}

runTests();