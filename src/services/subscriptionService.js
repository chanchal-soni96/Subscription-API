
const subscriptionPrices = {
  monthly: 499,
  yearly: 4999,
};

export function getSubscriptionPrice(plan) {
  if (!Object.hasOwn(subscriptionPrices, plan)) { //Object.hasOwn() checks whether that plan exists as a direct property of our pricing object.
    throw new Error("Invalid subscription plan");
  }

  return subscriptionPrices[plan];
}
