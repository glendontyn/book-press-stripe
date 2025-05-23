const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs');
require('dotenv').config();

// Initialize Stripe with the API key directly from environment variable
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Confirm loading of Stripe API Keys
console.log("Stripe initialized:", process.env.STRIPE_SECRET_KEY ? "Key exists" : "Key missing");

var app = express();

// view engine setup (Handlebars)
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({}));

/**
 * Home route
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 * Checkout route
 */
app.get('/checkout', async function(req, res) {
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item;
  let title, amount, error;

  switch (item) {
    case '1':
      title = "The Art of Doing Science and Engineering"
      amount = 2300      
      break;
    case '2':
      title = "The Making of Prince of Persia: Journals 1985-1993"
      amount = 2500
      break;     
    case '3':
      title = "Working in Public: The Making and Maintenance of Open Source"
      amount = 2800  
      break;     
    default:
      // Included in layout view, feel free to assign error
      error = "No item selected"      
      break;
  }

  if (!error) {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'sgd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.render('checkout', {
      title: title,
      amount: amount,
      amount_dollars: (amount / 100).toFixed(2),
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } else {
    res.render('checkout', {
      error: error
    });
  }
});

/**
 * Success route
 */
app.get('/success', function(req, res) {
  const paymentIntentId = req.query.payment_intent;
  const amount = req.query.amount;
  
  res.render('success', {
    paymentIntentId: paymentIntentId,
    amount: amount,
    amount_dollars: (amount / 100).toFixed(2)
  });
});



/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Server error');
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log('Running in development mode');
});
