# Calculate Stripe MRR

### How it works

This script takes in a list of Stripe API keys and spits out the total MRR of the Stripe accounts to which they belong. The script works by fetching all active subscriptions from each Stripe account and summing the prorated unit amounts depending on the billing interval.

### Usage

To get started with the calculator, run these commands in order:

```
git clone https://github.com/meta-labs/calculate-stripe-mrr
cd calculate-stripe-mrr
yarn install
```

Navigate to the `.env` file in the local repository and add any Stripe secret key (it can be a burner, because we specify the API key to use on each request so it's only ever used to initialize the client).

Next, populate the array in `data/keys.js`. This should be a list of all the secret API keys for the Stripe accounts for which you want to calculate the total monthly MRR.

Once you're done, run this command:

```
yarn start
```
