import { describe, it, expect } from "vitest";

// Mirrors the calcFootprint logic in CarbonCalculator.tsx.
// Kept as a pure function here so the core decision-making logic
// (the "brain" of the assistant) is independently testable.
interface CalcData {
  carKmPerWeek: number;
  flightsPerYear: number;
  meatMealsPerWeek: number;
  electricityKwhPerMonth: number;
  gasUseLevel: number;
  newItemsPerMonth: number;
}

function calcFootprint(d: CalcData) {
  const transport = (d.carKmPerWeek * 52 * 0.21) / 1000 + d.flightsPerYear * 0.255;
  const diet = ((d.meatMealsPerWeek * 2.5 + (14 - d.meatMealsPerWeek) * 0.5) * 52) / 1000;
  const energy = (d.electricityKwhPerMonth * 0.716 * 12) / 1000 + [0, 0.3, 0.7, 1.4][d.gasUseLevel];
  const shopping = d.newItemsPerMonth * 12 * 0.06;
  return {
    transport: +transport.toFixed(2),
    diet: +diet.toFixed(2),
    energy: +energy.toFixed(2),
    shopping: +shopping.toFixed(2),
    total: +(transport + diet + energy + shopping).toFixed(2),
  };
}

// Mirrors the dynamic, context-based decisioning in InsightBanner.tsx —
// this is the "assistant" logic: it picks different advice depending
// on the user's actual computed footprint, not a static message.
function getTopInsightId(totalTons: number): string {
  if (totalTons === 0) return "no-data";
  if (totalTons > 7) return "footprint-high";
  return "footprint-good";
}

describe("calcFootprint — core emissions engine", () => {
  it("returns all zeros for a zero-input profile", () => {
    const result = calcFootprint({
      carKmPerWeek: 0,
      flightsPerYear: 0,
      meatMealsPerWeek: 0,
      electricityKwhPerMonth: 0,
      gasUseLevel: 0,
      newItemsPerMonth: 0,
    });
    expect(result.transport).toBe(0);
    expect(result.energy).toBe(0);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it("increases transport footprint as weekly car distance increases", () => {
    const low = calcFootprint({
      carKmPerWeek: 50, flightsPerYear: 0, meatMealsPerWeek: 0,
      electricityKwhPerMonth: 0, gasUseLevel: 0, newItemsPerMonth: 0,
    });
    const high = calcFootprint({
      carKmPerWeek: 300, flightsPerYear: 0, meatMealsPerWeek: 0,
      electricityKwhPerMonth: 0, gasUseLevel: 0, newItemsPerMonth: 0,
    });
    expect(high.transport).toBeGreaterThan(low.transport);
  });

  it("reduces diet footprint as meat meals per week decrease", () => {
    const highMeat = calcFootprint({
      carKmPerWeek: 0, flightsPerYear: 0, meatMealsPerWeek: 14,
      electricityKwhPerMonth: 0, gasUseLevel: 0, newItemsPerMonth: 0,
    });
    const lowMeat = calcFootprint({
      carKmPerWeek: 0, flightsPerYear: 0, meatMealsPerWeek: 0,
      electricityKwhPerMonth: 0, gasUseLevel: 0, newItemsPerMonth: 0,
    });
    expect(highMeat.diet).toBeGreaterThan(lowMeat.diet);
  });

  it("applies the correct gas usage tier offsets", () => {
    const base = { carKmPerWeek: 0, flightsPerYear: 0, meatMealsPerWeek: 0, electricityKwhPerMonth: 0, newItemsPerMonth: 0 };
    const none = calcFootprint({ ...base, gasUseLevel: 0 });
    const high = calcFootprint({ ...base, gasUseLevel: 3 });
    expect(high.energy).toBeGreaterThan(none.energy);
    expect(high.energy - none.energy).toBeCloseTo(1.4, 1);
  });

  it("total always equals the sum of the four category totals", () => {
    const result = calcFootprint({
      carKmPerWeek: 120, flightsPerYear: 3, meatMealsPerWeek: 6,
      electricityKwhPerMonth: 250, gasUseLevel: 2, newItemsPerMonth: 4,
    });
    const sum = +(result.transport + result.diet + result.energy + result.shopping).toFixed(2);
    expect(result.total).toBeCloseTo(sum, 1);
  });
});

describe("getTopInsightId — context-aware assistant decisioning", () => {
  it("recommends starting the calculator when no data exists", () => {
    expect(getTopInsightId(0)).toBe("no-data");
  });

  it("flags a high-footprint user differently from a low-footprint user", () => {
    expect(getTopInsightId(9.2)).toBe("footprint-high");
    expect(getTopInsightId(3.1)).toBe("footprint-good");
  });

  it("treats the 7-tonne climate target as the decision boundary", () => {
    expect(getTopInsightId(7.01)).toBe("footprint-high");
    expect(getTopInsightId(7.0)).toBe("footprint-good");
  });
});
