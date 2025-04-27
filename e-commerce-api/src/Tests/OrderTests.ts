import Order from "@models/entities/Order";
import Product from "@models/entities/Product";
import { ObjectId } from "mongodb";

function runOrderTests() {
  console.log("Running basic tests for Order class...");

  // Test 1: Create an order and add products
  const order = new Order();

  const product1 = new Product();
  product1.id = new ObjectId();
  product1.price = 100;

  order.addProduct(product1, 2);

  console.log("Test 1: Add product to order");
  console.log("Expected lineItems length: 1");
  console.log("Actual lineItems length:", order.lineItems.length);
  console.log("Expected quantity for product1: 2");
  console.log("Actual quantity for product1:", order.lineItems[0].quantity);

  // Test 2: Add another product
  const product2 = new Product();
  product2.id = new ObjectId();
  product2.price = 50;

  order.addProduct(product2, 1);

  console.log("\nTest 2: Add another product to order");
  console.log("Expected lineItems length: 2");
  console.log("Actual lineItems length:", order.lineItems.length);
  console.log("Expected quantity for product2: 1");
  console.log("Actual quantity for product2:", order.lineItems[1].quantity);

  // Test 3: Update quantity of an existing product
  order.addProduct(product1, 3);

  console.log("\nTest 3: Update quantity of existing product");
  console.log("Expected lineItems length: 2");
  console.log("Actual lineItems length:", order.lineItems.length);
  console.log("Expected quantity for product1: 5");
  console.log("Actual quantity for product1:", order.lineItems[0].quantity);

  // Test 4: Setup order from mock database data
  const mockData = {
    customerDetails: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    lineItems: [
      { product: { id: new ObjectId(), price: 100 }, quantity: 2 },
      { product: { id: new ObjectId(), price: 50 }, quantity: 1 },
    ],
  };

  const orderFromDb = new Order();
  orderFromDb.setupFromDatabase(mockData);

  console.log("\nTest 4: Setup order from database data");
  console.log("Expected customer name: John Doe");
  console.log("Actual customer name:", orderFromDb.customerDetails.name);
  console.log("Expected lineItems length: 2");
  console.log(orderFromDb)
  console.log("Actual lineItems length:", orderFromDb.lineItems.length);
  console.log("Expected quantity for first line item: 2");
  console.log(
    "Actual quantity for first line item:",
    orderFromDb.lineItems[0].quantity
  );
}

// Run the tests
runOrderTests();
