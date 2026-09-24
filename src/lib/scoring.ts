import { Issue, ScoreBreakdown } from "@/types/civic";

export const CITY_MEAN_DEFAULT = 54.0;
export const K_BAYESIAN_FACTOR = 15;
export const MIN_ISSUES_FOR_RANK = 5;

/**
 * Calculates individual issue weight:
 * weight = (1 + 0.5 if Dangerous) * (1 + log2(1 + weightedAffected))
 */
export function calculateIssueWeight(
  isDangerous: boolean,
  weightedAffected: number
): number {
  const severityMultiplier = isDangerous ? 1.5 : 1.0;
  const affectedFactor = 1 + Math.log2(1 + Math.max(0, weightedAffected));
  return severityMultiplier * affectedFactor;
}

/**
 * Computes full mathematical score breakdown for a UC over eligible issues
 */
export function computeUCScoreBreakdown(
  issues: Issue[],
  eventsCount: number = 2,
  promisesKept: number = 3,
  promisesDue: number = 4,
  cityMean: number = CITY_MEAN_DEFAULT
): ScoreBreakdown {
  const eligibleIssues = issues.filter((i) => i.eligible);
  const n = eligibleIssues.length;

  if (n === 0) {
    return {
      resolutionRateScore: 0,
      speedScore: 50,
      responsivenessScore: 0,
      reliabilityScore: 100,
      backlogScore: 100,
      engagementScore: 50,
      rawScore: 0,
      smoothedScore: cityMean,
      cityMean,
      kFactor: K_BAYESIAN_FACTOR,
      eligibleCount: 0,
    };
  }

  // 1. Resolution Rate (35% weight)
  let totalEligibleWeight = 0;
  let resolvedWeightedScore = 0;
  let acknowledgedWithin72hCount = 0;
  let openOver30DaysCount = 0;
  let reopenedCount = 0;
  let totalResolutionsAttempted = 0;
  const resolutionDaysList: number[] = [];

  for (const issue of eligibleIssues) {
    const weight = calculateIssueWeight(
      issue.severity === "dangerous",
      issue.weightedAffected || 1
    );
    totalEligibleWeight += weight;

    if (issue.status === "confirmed" || issue.status === "community_resolved") {
      resolvedWeightedScore += weight * 1.0;
      totalResolutionsAttempted += 1;
      resolutionDaysList.push(issue.daysOpen);
    } else if (issue.status === "marked_resolved") {
      resolvedWeightedScore += weight * 0.5; // unconfirmed count at 0.5
      totalResolutionsAttempted += 1;
    } else if (issue.status === "reopened") {
      reopenedCount += 1;
      totalResolutionsAttempted += 1;
    }

    // Responsiveness
    if (
      issue.officialResponse ||
      issue.status === "acknowledged" ||
      issue.status === "in_progress" ||
      issue.status === "marked_resolved" ||
      issue.status === "confirmed"
    ) {
      acknowledgedWithin72hCount += 1;
    }

    // Backlog (>30 days open and not resolved)
    if (
      issue.daysOpen > 30 &&
      issue.status !== "confirmed" &&
      issue.status !== "marked_resolved"
    ) {
      openOver30DaysCount += 1;
    }
  }

  const resolutionRateRatio =
    totalEligibleWeight > 0 ? resolvedWeightedScore / totalEligibleWeight : 0;
  const resolutionRateScore = Math.min(100, Math.round(resolutionRateRatio * 100));

  // 2. Speed (20% weight) - Median days vs city benchmark (~10 days)
  let speedScore = 50;
  if (resolutionDaysList.length > 0) {
    resolutionDaysList.sort((a, b) => a - b);
    const mid = Math.floor(resolutionDaysList.length / 2);
    const medianDays =
      resolutionDaysList.length % 2 !== 0
        ? resolutionDaysList[mid]
        : (resolutionDaysList[mid - 1] + resolutionDaysList[mid]) / 2;

    const cityCategoryBenchmarkDays = 10;
    if (medianDays <= cityCategoryBenchmarkDays * 0.5) {
      speedScore = 100;
    } else if (medianDays >= cityCategoryBenchmarkDays * 3) {
      speedScore = 0;
    } else {
      // Linear interpolate between 0 and 100
      speedScore = Math.round(
        Math.max(
          0,
          Math.min(
            100,
            100 - ((medianDays - 5) / (cityCategoryBenchmarkDays * 3 - 5)) * 100
          )
        )
      );
    }
  }

  // 3. Responsiveness (15% weight)
  const responsivenessRatio = acknowledgedWithin72hCount / n;
  const responsivenessScore = Math.min(100, Math.round(responsivenessRatio * 100));

  // 4. Reliability (10% weight) - 1 - reopen rate
  const reopenRate =
    totalResolutionsAttempted > 0
      ? reopenedCount / totalResolutionsAttempted
      : 0;
  const reliabilityScore = Math.round((1 - Math.min(1, reopenRate)) * 100);

  // 5. Backlog Control (10% weight) - (1 - share of open issues >30 days) * 100
  const openShareOver30d = openOver30DaysCount / n;
  const backlogScore = Math.round((1 - Math.min(1, openShareOver30d)) * 100);

  // 6. Engagement (10% weight) - Verified events + Kept promises
  const verifiedEventsCount = Math.min(2, eventsCount);
  const promiseKeptRate =
    promisesDue > 0 ? Math.min(1, promisesKept / promisesDue) : 0.7;
  const engagementScore = Math.min(
    100,
    Math.round(verifiedEventsCount * 25 + promiseKeptRate * 50)
  );

  // Weighted sum
  const rawScore =
    resolutionRateScore * 0.35 +
    speedScore * 0.2 +
    responsivenessScore * 0.15 +
    reliabilityScore * 0.1 +
    backlogScore * 0.1 +
    engagementScore * 0.1;

  // Bayesian smoothing
  const smoothedScore =
    (n / (n + K_BAYESIAN_FACTOR)) * rawScore +
    (K_BAYESIAN_FACTOR / (n + K_BAYESIAN_FACTOR)) * cityMean;

  return {
    resolutionRateScore,
    speedScore,
    responsivenessScore,
    reliabilityScore,
    backlogScore,
    engagementScore,
    rawScore: Math.round(rawScore * 10) / 10,
    smoothedScore: Math.round(smoothedScore * 10) / 10,
    cityMean,
    kFactor: K_BAYESIAN_FACTOR,
    eligibleCount: n,
  };
}
