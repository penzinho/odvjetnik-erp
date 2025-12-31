export type FeeInput = {
  caseValueEur: number;
  action?: string;
};

export type FeeResult = {
  net: number;
  vat: number;
  total: number;
  points: number;
  pointValueEur: number;
};

const POINTS_PER_ACTION = 25;
const POINT_VALUE_EUR = 2;
const VAT_RATE = 0.25;

export function calculateFee(input: FeeInput): FeeResult | null {
  const { caseValueEur, action } = input;

  if (!Number.isFinite(caseValueEur) || caseValueEur < 0) {
    return null;
  }

  if (!action) {
    return null;
  }

  const isBaseRange = caseValueEur <= 332;
  const isSupportedAction = action === "tuzba" || action === "podnesak";

  if (!isBaseRange || !isSupportedAction) {
    return null;
  }

  const net = POINTS_PER_ACTION * POINT_VALUE_EUR;
  const vat = net * VAT_RATE;
  const total = net + vat;

  return {
    net,
    vat,
    total,
    points: POINTS_PER_ACTION,
    pointValueEur: POINT_VALUE_EUR,
  };
}
