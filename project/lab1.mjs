"use strict";

function Bowl(id, size, base, proteins, ingredients, quantity = 1, specialRequests = '') {
    this.id = id;
    this.size = size;
    this.base = base;
    this.proteins = proteins;
    this.ingredients = ingredients;
    this.quantity = quantity;
    this.specialRequests = specialRequests;
    this.price = 0; // Inizializza a 0, sarà calcolato
}

function Order(id, userId = null) {
    this.id = id;
    this.userId = userId;
    this.bowls = []; // Array of Bowl objects
    this.totalPrice = 0; // Total price of the order
    this.status = 'pending'; // Default status
}

// Configuration object for the shop
const ShopConfig = {
    maxRegularBowls: 10,
    maxMediumBowls: 8,
    maxLargeBowls: 6,
    priceRegular: 9,
    priceMedium: 11,
    priceLarge: 14,
    excessIngredientSurcharge: 0.20, // 20%
    discountThresholdBowls: 4,
    discountPercentage: 0.10 // 10%
}

// Example for OrderCollection
function OrderCollection() {
    this.orders = [];
    let nextOrderId = 1; // Simple counter for IDs

    // Assign an ID if not already present (or handle ID generation)
    this.addOrder = (order) => {     
        if (!order.id) {
            order.id = nextOrderId++;
        }
        this.orders.push(order);
        console.log(`Order ${order.id} added.`);
        return order;
    }

    this.getOrderById = (id) => {
        return this.orders.find(order => order.id === id);
    }

    this.getOrderByUserId = (userId) => {
        return this.orders.filter(order => order.userId === userId);
    }
}


const myOrders = new OrderCollection();

// Ordine 1: 1 R bowl
const bowl1_1 = new Bowl(1, 'R', 'rice', ['salmon'], ['avocado', 'kale'], 1);
const order1 = new Order(1, 'user1');
order1.bowls.push(bowl1_1);
myOrders.addOrder(order1);

// Ordine 2: 2 M bowls
const bowl2_1 = new Bowl(2, 'M', 'black rice', ['tuna', 'chicken'], ['mango', 'peppers', 'corn'], 2);
const order2 = new Order(2, 'user2');
order2.bowls.push(bowl2_1);
myOrders.addOrder(order2);

// Ordine 3: 1 L bowl con ingredienti extra (per testare il 20%)
const bowl3_1 = new Bowl(3, 'L', 'salad', ['tofu', 'salmon', 'chicken'], ['avocado', 'ananas', 'cashew nuts', 'kale', 'mango', 'peppers', 'corn'], 1); // 7 ingredients, 1 extra
const order3 = new Order(3, 'user1');
order3.bowls.push(bowl3_1);
myOrders.addOrder(order3);

// Ordine 4: 5 R bowls (per testare lo sconto del 10%)
const bowl4_1 = new Bowl(4, 'R', 'rice', ['tuna'], ['wakame', 'tomatoes'], 5);
const order4 = new Order(4, 'user3');
order4.bowls.push(bowl4_1);
myOrders.addOrder(order4);

// Ordine 5: Combinazione di bowl
const bowl5_1 = new Bowl(5, 'R', 'rice', ['salmon'], ['avocado'], 1);
const bowl5_2 = new Bowl(6, 'M', 'salad', ['tuna', 'tofu'], ['kale', 'corn'], 1);
const order5 = new Order(5, 'user2');
order5.bowls.push(bowl5_1);
order5.bowls.push(bowl5_2);
myOrders.addOrder(order5);


console.log("\nAll Orders:");
console.log(myOrders.orders);

console.log("\nOrder with ID 3:");
console.log(myOrders.getOrderById(3));

console.log("\nOrders by User ID 'user1':");
console.log(myOrders.getOrdersByUserId('user1'));

console.log("\nOrders sorted by total price (will be 0 for now as price calculation is not implemented yet):");
console.log(myOrders.sortOrdersByTotalPrice());

// Esempio di modifica dello stato
myOrders.updateOrderStatus([1, 2], 'confirmed');
console.log("\nOrders after status update:");
console.log(myOrders.orders);

// Esempio di eliminazione
myOrders.deleteOrderById(4);
console.log("\nOrders after deleting Order 4:");
console.log(myOrders.orders);