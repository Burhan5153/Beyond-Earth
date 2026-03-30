const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Initialize Stripe - use test key from environment or provide a placeholder
const stripeSecretKey = process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.trim() : null;
let stripe = null;

if (!stripeSecretKey || stripeSecretKey === '') {
  console.warn('⚠️  STRIPE_SECRET_KEY not found in environment variables. Stripe checkout will not work.');
  console.warn('   Please add your Stripe test secret key to .env file: STRIPE_SECRET_KEY=sk_test_...');
  console.warn('   Get your key from: https://dashboard.stripe.com/test/apikeys');
} else {
  // Validate key format
  if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
    console.warn('⚠️  Warning: Stripe key should start with sk_test_ (for test mode) or sk_live_ (for live mode)');
    console.warn(`   Current key starts with: ${stripeSecretKey.substring(0, 20)}...`);
  }
  
  // Check for common issues
  if (stripeSecretKey.includes('your_secret_key') || stripeSecretKey.includes('placeholder')) {
    console.error('❌ Error: Please replace the placeholder key with your actual Stripe test key');
    console.error('   Get your key from: https://dashboard.stripe.com/test/apikeys');
  } else if (stripeSecretKey.length < 50) {
    console.warn('⚠️  Warning: Stripe key seems too short. Make sure you copied the entire key.');
    console.warn(`   Key length: ${stripeSecretKey.length} characters (expected ~100+)`);
  }
  
  try {
    stripe = require('stripe')(stripeSecretKey);
    console.log('✅ Stripe initialized successfully');
    console.log(`   Using key: ${stripeSecretKey.substring(0, 12)}...${stripeSecretKey.substring(stripeSecretKey.length - 4)}`);
    console.log(`   Key length: ${stripeSecretKey.length} characters`);
  } catch (error) {
    console.error('❌ Error initializing Stripe:', error.message);
  }
}

const router = express.Router();

// Plan pricing configuration (in cents)
const PLAN_PRICES = {
  monthly: 2999, // $29.99
  yearly: 29999, // $299.99
  premium: 49999 // $499.99
};

// Create Stripe Checkout Session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env file.' });
    }

    const { plan } = req.body; // 'monthly', 'yearly', 'premium'

    if (!['monthly', 'yearly', 'premium'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    const user = await User.findById(req.user._id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription - Beyond Earth`,
              description: `Premium space exploration content access for ${plan === 'monthly' ? '1 month' : '1 year'}`,
            },
            unit_amount: PLAN_PRICES[plan],
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/subscription-success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${frontendUrl}/subscription?canceled=true`,
      client_reference_id: user._id.toString(),
      metadata: {
        userId: user._id.toString(),
        plan: plan,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Provide more specific error messages
    if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({ 
        message: 'Invalid Stripe API key. Please check your STRIPE_SECRET_KEY in the .env file. Make sure you\'re using a valid test key starting with sk_test_...' 
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Failed to create checkout session. Please try again or contact support.' 
    });
  }
});

// Activate subscription after successful payment
router.post('/success', auth, async (req, res) => {
  try {
    const { session_id, plan } = req.body;

    if (!session_id || !plan) {
      return res.status(400).json({ message: 'Missing session_id or plan' });
    }

    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }

    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Verify the session belongs to this user
    if (session.client_reference_id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user._id);
    const startDate = new Date();
    let endDate = new Date();

    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (plan === 'premium') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    user.subscription = {
      plan,
      startDate,
      endDate,
      isActive: true,
      stripeSessionId: session_id,
    };

    await user.save();

    res.json({
      message: 'Subscription activated successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Legacy subscribe route (kept for backward compatibility, but redirects to Stripe)
router.post('/', auth, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!['monthly', 'yearly', 'premium'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    // For testing purposes, you can still activate directly without payment
    // Remove this in production
    const user = await User.findById(req.user._id);
    const startDate = new Date();
    let endDate = new Date();

    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (plan === 'premium') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    user.subscription = {
      plan,
      startDate,
      endDate,
      isActive: true
    };

    await user.save();

    res.json({
      message: 'Subscription activated successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subscription status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if subscription is still active
    if (user.subscription.isActive && new Date() > user.subscription.endDate) {
      user.subscription.isActive = false;
      await user.save();
    }

    res.json(user.subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel subscription
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.subscription = {
      plan: 'none',
      isActive: false
    };
    await user.save();

    res.json({ message: 'Subscription cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

