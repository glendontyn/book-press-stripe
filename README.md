# Stripe Press Shop

A simple e-commerce application for Stripe Press books with integrated Stripe payment processing.

## How to Build, Configure and Run the Application

### Prerequisites
- [Node.js installed](https://nodejs.org/en/download)
- [Stripe account with API keys](https://dashboard.stripe.com/login_success?redirect=%2F)

### Setup and Installation

Step 1. Clone the repository and install dependencies:
```bash
git clone https://github.com/glendontyn/book-press-stripe.git
npm install
```

Step 2. Configure environment variables:
```bash
# Copy the sample environment file
cp sample.env .env

# Edit .env with your Stripe API keys
# STRIPE_SECRET_KEY=sk_test_your_key
# STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

Step 3. Run the application:
```bash
npm start
```

Step 4. Access the application at [http://localhost:3000](http://localhost:3000)

Alternatively, you can also access the web application hosted on a public endpoint [here](http://stripe-press-shop-env.eba-uz6mqxcp.us-east-1.elasticbeanstalk.com/).
## How the Solution Works

This application demonstrates a simple e-commerce flow for purchasing books, integrated with Stripe's managed payment APIs.

### Stripe APIs Used

1. **PaymentIntent API**
   - Creates payment intents on the server side
   - Tracks the payment lifecycle
   - Handles payment amount and currency

2. **Stripe.js and Elements**
   - Loads `Stripe.js` on the client side
   - Uses the Payment Element for secure payment collection
   - Handles payment method input, validation, and submission

3. **Automatic Payment Methods**
   - Enables flexible payment options based on customer location

### Application Architecture

The application follows a simple Model-View-Controller (or MVC)-like architecture:

1. **Server (`app.js`)**
   - `Express.js` web server
   - Handles routes and business logic
   - Integrates with Stripe API
   - Renders views with data

2. **Views (Handlebars templates)**
   - `index.hbs`: Product catalog
   - `checkout.hbs`: Payment form with Stripe Elements
   - `success.hbs`: Order confirmation
   - `layouts/main.hbs`: Main layout template

3. **Static Assets**
   - CSS for styling
   - Images for product display

4. **Data Flow**
- **Step 1**: User selects a book
   - The customer browses the product catalog on the homepage and chooses a Stripe Press book to purchase.

- **Step 2**: Server creates a `PaymentIntent`
   - Upon initiating checkout, the server generates a `PaymentIntent` via Stripe’s API, specifying the amount, currency, and payment options.

- **Step 3**: Client loads Stripe Elements
   - The checkout page initializes `Stripe.js` and renders the Payment Element, securely collecting the user’s payment details.
   
- **Step 4**: User submits payment information
   - The customer enters their payment data, which will be validated by Stripe Elements to ensure correctness.

- **Step 5**:  Stripe processes the payment
   - The `PaymentIntent` is confirmed asynchronously with Stripe, handling authorization, and final settlement.

- **Step 6**: Server responds with payment status
   - The server receives the payment result and relays success or failure back to the client.

- **Step 7**:  User is redirected to confirmation page
   - On successful payment, the user is shown an order confirmation page summarizing their purchase.

## Approach 

### Development Process
To begin building the app, I started by analyzing the existing code structure of the boiler plate to understand its current state and identify the missing payment functionality. I then determined which Stripe APIs would be most appropriate for the project’s needs (e.g. reading up on the differences between Stripe Payment Element and Stripe Checkout).

I followed up with implementation by integrating Stripe’s `PaymentIntent` API on the server side and the Payment Element on the client side to create a secure and seamless checkout experience. I connected the frontend and backend components to establish communication between them, and added error handling and success flows to provide users with reliable feedback throughout the payment process.

### Documentation Used

- [Stripe PaymentIntents API](https://stripe.com/docs/api/payment_intents)
- [Stripe Elements documentation](https://stripe.com/docs/payments/elements)
- [Stripe Payment Element guide](https://stripe.com/docs/payments/payment-element)
- [Express.js documentation](https://expressjs.com/en/guide/routing.html)
- [Handlebars templating guide](https://handlebarsjs.com/guide/)

### Challenges Encountered
In this build, I encountered several challenges related to configuration management, particularly when setting up and accessing Stripe API keys correctly and troubleshooting “API key not provided” errors when keys weren’t properly loaded. Server configuration required careful attention, including ensuring the app listened on the correct port and setting up the right routing for payment endpoints. Error handling was critical, both for Stripe API calls (like network timeouts) and for creating user-friendly messages during payment failures.

Client-server integration involved securely passing client secrets, initializing `Stripe.js` correctly, and managing asynchronous payment confirmation flows. The responsive payment form with Stripe Elements helped me easily establish a seamless and intuitive checkout flow with pre-payment validation, which I can easily integrate with post-payment confirmation pages. 

## Future Extensions
The main focus of this proof-of-concept has been put into implementing the payment functionality by integrating Stripe's APIs into the web application. In a real production use-case, we need to consider the areas of Security, Reliability, Performance Efficiency, Cost Optimization and Operational Excellence prior to deployment. 

### Security 
Currently, the project lacks several essential security and stability features, such as rate limiting for API endpoints, which we can address using exponential backoff to prevent server overload in production, as well as input sanitization for query parameters. To enhance security, we can implement CSRF protection with the csurf middleware, add input validation and sanitization using express-validator, and configure security headers via the helmet middleware. Additionally, we can establish proper logging for security events and implement robust user authentication and account management using solutions like Passport.js or Auth0.

### Reliability
To improve reliability, we can replace the existing hardcoded data with a proper database (e.g. MongoDB or PostgreSQL) for storage of products and orders, and implement error handling middleware with structured logging. We can also add webhook handling to manage asynchronous payment events like payment_intent.succeeded, ensuring smooth integration with payment providers. In production, we should also implement automated testing (including unit, integration, and end-to-end tests) for reliability and maintainability of the application.

### Performance Efficiency
To ensure performance, especially at scale, we can look to bundle and minify client-side assets to reduce load times, implement effective caching strategies for static content, and add response compression to minimize the size of HTTP responses. When a database is in place, we can optimize database queries to ensure efficient data retrieval and processing. Additionally, we can leverage a content delivery network (CDN) for delivering static assets, which will distribute files across multiple servers closer to users, further enhancing application speed and reliability.

### Operational Excellence 
To maintain operational excellence as the project grows, we can start with several enhancements to the project's architecture and structure. Firstly, we can implement a proper MVC structure with separate controllers and models, and ensure business logic is separated from route handlers for better maintainability. As an example, the project currently implements all routes within `app.js`, which will become difficult to maintain as the application grows. In a production implementation, they should be moved to separate directory with logical grouping to improve code readability and maintainability.

### User Experience Enhancements
To enhance the user experience, we can add a shopping cart functionality allowing customers to purchase multiple items in a single transaction, and implement order history tracking for registered users to review their past purchases. We can develop support for discount codes and promotions to drive sales and customer loyalty. Additionally, we can add product search and filtering capabilities to help customers find items more efficiently, and set up email confirmation systems that automatically notify customers when orders are placed, processed, and shipped.

### Stripe Integration Enhancements
Finally, we can also embed additional enhancements in the way we integrate Stripe's offerings. We can implement payment verification on the success page using the Stripe API to confirm transactions before finalizing orders, and support saved payment methods for returning customers to simplify repeat purchases. For scalability, we can add subscription capabilities to handle recurring payments and implement Stripe Connect if the platform involves multiple sellers, enabling secure marketplace functionality like split payments or vendor payouts.
