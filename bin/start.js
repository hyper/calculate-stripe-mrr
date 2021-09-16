const stripe = require('../lib/stripe');
const stripeAPIKeys = require('../data/keys');

(async () => {
  let totalMonthlyGMV = 0;

  for (const apiKey of stripeAPIKeys) {
    try {
      const subscriptions = [];
      let hasMore = true;
      let startingAfter;

      // Fetch all subscriptions from Stripe's paginated API
      while (hasMore) {
        const list = await stripe.subscriptions.list({
          limit: 100,
          ...(startingAfter && { starting_after: startingAfter }),
        }, { apiKey });

        subscriptions.push(...list.data);
        hasMore = list.has_more;
        startingAfter = list.data[list.data.length - 1].id;
      }

      // Calculate prorated MRR based on active subscriptions and their billing intervals, excluding discounts
      const mrr = subscriptions
        .filter((subscription) => subscription.status === 'active')
        .reduce((r, subscription) => {
          const unitAmount = subscription.items.data[0].price.unit_amount;
          const interval = subscription.items.data[0].price.recurring.interval;

          if (interval === 'day') return r + (unitAmount * 30);
          if (interval === 'week') return r + (unitAmount * 4);
          if (interval === 'month') return r + unitAmount;
          if (interval === 'year') return r + (unitAmount / 12);
        }, 0);

      totalMonthlyGMV += mrr;

      console.log(`Calculated for ${apiKey.substring(0,16)}...: $${mrr / 100}`)
    } catch (err) {
      console.log(`Failed for ${apiKey.substring(0,16)}...`)
      console.log(err);
    }
  }

  console.log('\nTotal monthly GMV:', `$${totalMonthlyGMV / 100}\n`)
})()
