import dayjs from 'dayjs';

console.log('=== POKE SHOP LAB 1 ===\n');

// Constructor function per User
function User(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.orders = [];
    this.createdAt = dayjs();

    this.addOrder = (order) => {
        this.orders.push(order);
    };

    this.getTotalOrders = () => {
        return this.orders.length;
    };

    this.getTotalSpent = () => {
        return this.orders.reduce((total, order) => total + order.getTotalPrice(), 0);
    };

    this.toString = () => {
        return `User: ${this.username} (${this.email}) - ${this.orders.length} orders`;
    };
}

// Constructor function per PokeBowl
function PokeBowl(id, size, base, proteins, ingredients, quantity = 1) {
    this.id = id;
    this.size = size; // 'R', 'M', 'L'
    this.base = base; // 'rice', 'black rice', 'salad'
    this.proteins = proteins; // array di proteine
    this.ingredients = ingredients; // array di ingredienti
    this.quantity = quantity;

    const basePrices = { 'R': 9, 'M': 11, 'L': 14 };
    const includedIngredients = { 'R': 4, 'M': 4, 'L': 6 };
    const maxProteins = { 'R': 1, 'M': 2, 'L': 3 };

    this.isValid = () => {
        return this.proteins.length <= maxProteins[this.size] && this.ingredients.length >= 1;
    };

    this.getPrice = () => {
        let price = basePrices[this.size];
        const extraIngredients = Math.max(0, this.ingredients.length - includedIngredients[this.size]);
        price += price * 0.2 * extraIngredients;
        return price;
    };

    this.getTotalPrice = () => {
        return this.getPrice() * this.quantity;
    };

    this.toString = () => {
        return `${this.quantity}x ${this.size} bowl - ${this.base}, ${this.proteins.join(', ')}, ${this.ingredients.join(', ')} - €${this.getTotalPrice().toFixed(2)}`;
    };
}

// Constructor function per Order
function Order(id, userId, specialRequests = '') {
    this.id = id;
    this.userId = userId;
    this.bowls = [];
    this.specialRequests = specialRequests;
    this.createdAt = dayjs();
    this.isConfirmed = false;

    this.addBowl = (bowl) => {
        if (bowl.isValid()) {
            this.bowls.push(bowl);
            return true;
        }
        return false;
    };

    this.removeBowl = (bowlId) => {
        const index = this.bowls.findIndex(bowl => bowl.id === bowlId);
        if (index !== -1) {
            this.bowls.splice(index, 1);
            return true;
        }
        return false;
    };

    this.getTotalPrice = () => {
        let total = this.bowls.reduce((sum, bowl) => sum + bowl.getTotalPrice(), 0);
        const totalBowlsCount = this.bowls.reduce((sum, bowl) => sum + bowl.quantity, 0);
        if (totalBowlsCount > 4) {
            total *= 0.9; // 10% discount
        }
        return total;
    };

    this.getTotalBowlsCount = () => {
        return this.bowls.reduce((sum, bowl) => sum + bowl.quantity, 0);
    };

    this.confirm = () => {
        this.isConfirmed = true;
    };

    this.toString = () => {
        return `Order #${this.id} - ${this.bowls.length} types, ${this.getTotalBowlsCount()} total bowls - €${this.getTotalPrice().toFixed(2)} - ${this.createdAt.format('YYYY-MM-DD HH:mm')}`;
    };
}

// Constructor function per PokeShop (container principale)
function PokeShop() {
    this.users = [];
    this.orders = [];
    this.dailyAvailability = { 'R': 10, 'M': 8, 'L': 6 };
    this.soldToday = { 'R': 0, 'M': 0, 'L': 0 };
    
    this.availableBases = ['rice', 'black rice', 'salad'];
    this.availableProteins = ['tuna', 'chicken', 'salmon', 'tofu'];
    this.availableIngredients = ['avocado', 'ananas', 'cashew nuts', 'kale', 'mango', 'peppers', 'corn', 'wakame', 'tomatoes', 'carrots', 'salad'];

    // Metodi per aggiungere oggetti alla collezione
    this.addUser = (user) => {
        this.users.push(user);
    };

    this.addOrder = (order) => {
        if (this.checkAvailability(order)) {
            this.orders.push(order);
            this.updateAvailability(order);
            order.confirm();
            
            const user = this.findUser(order.userId);
            if (user) {
                user.addOrder(order);
            }
            return true;
        }
        return false;
    };

    // Metodi per recuperare oggetti in base a criteri specifici
    this.findUser = (userId) => {
        return this.users.find(user => user.id === userId);
    };

    this.getUserByUsername = (username) => {
        return this.users.find(user => user.username === username);
    };

    this.getOrdersByUser = (userId) => {
        return this.orders.filter(order => order.userId === userId);
    };

    this.getOrdersByDate = () => {
        return [...this.orders].sort((a, b) => a.createdAt.isAfter(b.createdAt) ? 1 : -1);
    };

    // Metodi per manipolare la collezione
    this.sortUsersBySpent = () => {
        return [...this.users].sort((a, b) => b.getTotalSpent() - a.getTotalSpent());
    };

    this.getHighSpendingUsers = (minSpent) => {
        return this.users.filter(user => user.getTotalSpent() >= minSpent);
    };

    // Metodi per eliminare oggetti
    this.removeUser = (userId) => {
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    };

    this.removeOrder = (orderId) => {
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
            this.orders.splice(index, 1);
            return true;
        }
        return false;
    };

    // Metodi di supporto
    this.checkAvailability = (order) => {
        const needed = { 'R': 0, 'M': 0, 'L': 0 };
        order.bowls.forEach(bowl => {
            needed[bowl.size] += bowl.quantity;
        });

        return needed['R'] <= (this.dailyAvailability['R'] - this.soldToday['R']) &&
               needed['M'] <= (this.dailyAvailability['M'] - this.soldToday['M']) &&
               needed['L'] <= (this.dailyAvailability['L'] - this.soldToday['L']);
    };

    this.updateAvailability = (order) => {
        order.bowls.forEach(bowl => {
            this.soldToday[bowl.size] += bowl.quantity;
        });
    };

    this.getAvailability = () => {
        return {
            'R': this.dailyAvailability['R'] - this.soldToday['R'],
            'M': this.dailyAvailability['M'] - this.soldToday['M'],
            'L': this.dailyAvailability['L'] - this.soldToday['L']
        };
    };

    this.getDailySales = () => {
        return this.orders.reduce((total, order) => total + order.getTotalPrice(), 0);
    };

    this.toString = () => {
        const availability = this.getAvailability();
        return `PokeShop - Available: R:${availability.R}, M:${availability.M}, L:${availability.L} - Users: ${this.users.length}, Orders: ${this.orders.length}`;
    };
}

console.log('Oggetti definiti correttamente!\n');

// === POPOLAMENTO E TEST ===

// Creare il negozio
const shop = new PokeShop();

// Creare utenti di esempio (almeno 5 come richiesto)
const user1 = new User(1, "mario_rossi", "mario@email.com");
const user2 = new User(2, "giulia_verdi", "giulia@email.com");
const user3 = new User(3, "luca_bianchi", "luca@email.com");
const user4 = new User(4, "anna_neri", "anna@email.com");
const user5 = new User(5, "paolo_blu", "paolo@email.com");

// Aggiungere utenti al negozio
shop.addUser(user1);
shop.addUser(user2);
shop.addUser(user3);
shop.addUser(user4);
shop.addUser(user5);

console.log("=== UTENTI REGISTRATI ===");
shop.users.forEach(user => console.log(`- ${user.toString()}`));

// Creare poke bowls di esempio (almeno 5 come richiesto)
const bowl1 = new PokeBowl(1, 'R', 'rice', ['salmon'], ['avocado', 'mango', 'corn'], 2);
const bowl2 = new PokeBowl(2, 'M', 'black rice', ['tuna', 'chicken'], ['kale', 'tomatoes', 'peppers', 'wakame']);
const bowl3 = new PokeBowl(3, 'L', 'salad', ['salmon', 'tuna', 'tofu'], ['avocado', 'ananas', 'cashew nuts', 'mango', 'corn', 'carrots'], 1);
const bowl4 = new PokeBowl(4, 'R', 'rice', ['chicken'], ['avocado'], 3);
const bowl5 = new PokeBowl(5, 'M', 'rice', ['salmon', 'chicken'], ['kale', 'mango', 'corn', 'tomatoes', 'wakame'], 1);

console.log("\n=== POKE BOWLS CREATI ===");
console.log(`Bowl 1: ${bowl1.toString()}`);
console.log(`Bowl 2: ${bowl2.toString()}`);
console.log(`Bowl 3: ${bowl3.toString()}`);
console.log(`Bowl 4: ${bowl4.toString()}`);
console.log(`Bowl 5: ${bowl5.toString()}`);

// Creare ordini di esempio
const order1 = new Order(1, user1.id, "No allergies");
order1.addBowl(bowl1);
order1.addBowl(bowl2);

const order2 = new Order(2, user2.id, "Extra spicy please");
order2.addBowl(bowl3);

const order3 = new Order(3, user3.id);
order3.addBowl(bowl4);
order3.addBowl(bowl5);

const order4 = new Order(4, user1.id);
order4.addBowl(bowl4);

const order5 = new Order(5, user4.id, "Vegetarian bowl please");
const veggieBowl = new PokeBowl(6, 'R', 'salad', ['tofu'], ['avocado', 'kale', 'corn', 'tomatoes'], 1);
order5.addBowl(veggieBowl);

console.log("\n=== TEST PROCESSAMENTO ORDINI ===");
console.log(`Disponibilità iniziale: ${JSON.stringify(shop.getAvailability())}`);

// Test aggiunta ordini
console.log(`\nProcessing Order 1: ${shop.addOrder(order1) ? 'SUCCESS' : 'FAILED'}`);
console.log(`- ${order1.toString()}`);

console.log(`\nProcessing Order 2: ${shop.addOrder(order2) ? 'SUCCESS' : 'FAILED'}`);
console.log(`- ${order2.toString()}`);

console.log(`\nProcessing Order 3: ${shop.addOrder(order3) ? 'SUCCESS' : 'FAILED'}`);
console.log(`- ${order3.toString()}`);

console.log(`\nProcessing Order 4: ${shop.addOrder(order4) ? 'SUCCESS' : 'FAILED'}`);
console.log(`- ${order4.toString()}`);

console.log(`\nProcessing Order 5: ${shop.addOrder(order5) ? 'SUCCESS' : 'FAILED'}`);
console.log(`- ${order5.toString()}`);

console.log(`\nDisponibilità finale: ${JSON.stringify(shop.getAvailability())}`);

console.log(`\n=== STATO FINALE NEGOZIO ===`);
console.log(shop.toString());
console.log(`Vendite giornaliere totali: €${shop.getDailySales().toFixed(2)}`);

// Test metodi di ricerca e manipolazione
console.log(`\n=== TEST METODI DI RICERCA ===`);

// Recuperare oggetti per criterio specifico
const marioOrders = shop.getOrdersByUser(user1.id);
console.log(`\nOrdini di Mario (${marioOrders.length}):`);
marioOrders.forEach(order => console.log(`- ${order.toString()}`));

// Ordinamento per data
console.log(`\nTutti gli ordini per data:`);
shop.getOrdersByDate().forEach(order => console.log(`- ${order.toString()}`));

// Manipolazione della collezione - ordinamento utenti per spesa
console.log(`\nUtenti ordinati per spesa (decrescente):`);
shop.sortUsersBySpent().forEach(user => {
    console.log(`- ${user.username}: €${user.getTotalSpent().toFixed(2)} in ${user.getTotalOrders()} ordini`);
});

// Test eliminazione
console.log(`\n=== TEST ELIMINAZIONE ===`);
console.log(`Utenti prima dell'eliminazione: ${shop.users.length}`);
const removedUser = shop.removeUser(user5.id);
console.log(`Rimozione utente Paolo: ${removedUser ? 'SUCCESS' : 'FAILED'}`);
console.log(`Utenti dopo l'eliminazione: ${shop.users.length}`);

console.log(`\nOrdini prima dell'eliminazione: ${shop.orders.length}`);
const removedOrder = shop.removeOrder(order5.id);
console.log(`Rimozione order 5: ${removedOrder ? 'SUCCESS' : 'FAILED'}`);
console.log(`Ordini dopo l'eliminazione: ${shop.orders.length}`);

console.log('\n=== LAB 1 COMPLETATO ===');
