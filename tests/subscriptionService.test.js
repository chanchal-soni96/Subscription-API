
import { describe, it, expect } from "vitest";
import { getSubscriptionPrice } from "../src/services/subscriptionService.js";

describe("getSubscriptionPrice", () => {
  
it("returns 499 for the monthly plan", () => {
  // Arrange: prepare the input
  const plan = "monthly";

  // Act: execute the function
  const price = getSubscriptionPrice(plan);

  // Assert: verify the expected result
  expect(price).toBe(499);
});


  it("returns 4999 for the yearly plan", () => {
    expect(getSubscriptionPrice("yearly")).toBe(4999);
  });

  it("throws an error for an invalid plan", () => {
    expect(() => getSubscriptionPrice("weekly")).toThrow(
      "Invalid subscription plan"
    );
  });

  it("throws an error when the plan is undefined", () => {
  expect(() => getSubscriptionPrice(undefined)).toThrow(
    "Invalid subscription plan"
  );
});

it("throws an error when the plan is null", () => {
  expect(() => getSubscriptionPrice(null)).toThrow(
    "Invalid subscription plan"
  );
});

it("throws an error when the plan is empty", () => {
  expect(() => getSubscriptionPrice("")).toThrow(
    "Invalid subscription plan"
  );
});

});
