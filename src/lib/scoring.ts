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

/**
 * Computes Community Leader 90-day score breakdown per Spec Addendum 01, Section 4.
 * Recalculated every 6 hours by PostgreSQL engine.
 * - Impact (40%): Weighted confirmed resolved adopted issues (max 15/month)
 * - Reliability (20%): On-time resolution rate minus reopen rate
 * - Events (15%): Verified events (max 2/month) + attendance
 * - Pledges (15%): Pledges kept ÷ pledges due
 * - Responsiveness (10%): First update within 72h of adoption
 * - Low-activity: k = 10 smoothing; <3 confirmed resolutions in 90d shows "Not enough activity"
 */
export function computeLeaderScoreBreakdown(
  adoptedIssues: Issue[],
  eventsCount: number = 0,
  pledgesKept: number = 0,
  pledgesDue: number = 0,
  cityMean: number = CITY_MEAN_DEFAULT
): import("@/types/civic").LeaderScoreBreakdown {
  const totalAdopted = adoptedIssues.length;

  let totalWeightedAdopted = 0;
  let totalWeightedResolved = 0;
  let confirmedResolutions90d = 0;
  let onTimeResolutionsCount = 0;
  let reopenedCount = 0;
  let totalResolutionsAttempted = 0;
  let updatedWithin72hCount = 0;

  // Monthly cap: max 15 resolutions per month count toward Impact (45 over 90 days)
  const MAX_RESOLUTIONS_PER_MONTH = 15;
  const MAX_RESOLUTIONS_90D = MAX_RESOLUTIONS_PER_MONTH * 3;

  for (const issue of adoptedIssues) {
    const weight = calculateIssueWeight(
      issue.severity === "dangerous",
      issue.weightedAffected || 1
    );
    totalWeightedAdopted += weight;

    // Check resolution
    if (issue.status === "confirmed" || issue.status === "community_resolved") {
      totalResolutionsAttempted += 1;
      if (confirmedResolutions90d < MAX_RESOLUTIONS_90D) {
        confirmedResolutions90d += 1;
        totalWeightedResolved += weight;
      }

      // Check if resolved on time (within targetDate)
      if (issue.targetDate) {
        const target = new Date(issue.targetDate).getTime();
        const updated = new Date(issue.updatedAt || issue.createdAt).getTime();
        if (updated <= target) {
          onTimeResolutionsCount += 1;
        }
      } else {
        onTimeResolutionsCount += 1;
      }
    } else if (issue.status === "marked_resolved") {
      totalResolutionsAttempted += 1;
      // Pending citizen confirmation counts at 50%
      totalWeightedResolved += weight * 0.5;
    } else if (issue.status === "reopened") {
      totalResolutionsAttempted += 1;
      reopenedCount += 1;
    }

    // Responsiveness: check if updated within 72 hours of adoption
    if (issue.leaderResponse || (issue.comments && issue.comments.some((c) => c.userRole === "community_leader"))) {
      updatedWithin72hCount += 1;
    } else if (issue.status === "in_progress" || issue.status === "marked_resolved") {
      updatedWithin72hCount += 1;
    }
  }

  // 1. Impact (40%): Weighted resolutions vs total adopted weight
  const impactRatio =
    totalWeightedAdopted > 0 ? totalWeightedResolved / totalWeightedAdopted : 0;
  const impactScore = Math.min(100, Math.round(impactRatio * 100));

  // 2. Reliability (20%): On-time rate minus reopen rate
  const onTimeRate =
    totalResolutionsAttempted > 0
      ? onTimeResolutionsCount / totalResolutionsAttempted
      : totalAdopted === 0
      ? 1
      : 0.8;
  const reopenRate =
    totalResolutionsAttempted > 0
      ? reopenedCount / totalResolutionsAttempted
      : 0;
  const reliabilityScore = Math.max(
    0,
    Math.min(100, Math.round((onTimeRate - reopenRate) * 100))
  );

  // 3. Community events (15%): Max 2/month (6 in 90 days)
  const eventsCapped = Math.min(eventsCount, 6);
  const eventsScore = Math.min(100, Math.round((eventsCapped / 6) * 100));

  // 4. Pledges kept (15%): Pledges kept ÷ pledges due
  const pledgesScore =
    pledgesDue > 0
      ? Math.min(100, Math.round((pledgesKept / pledgesDue) * 100))
      : 75; // Baseline if no pledges due yet

  // 5. Responsiveness (10%): Share of adoptions that got first update within 72 hours
  const responsivenessRatio =
    totalAdopted > 0 ? updatedWithin72hCount / totalAdopted : 1.0;
  const responsivenessScore = Math.min(100, Math.round(responsivenessRatio * 100));

  // Raw weighted sum
  const rawScore =
    impactScore * 0.40 +
    reliabilityScore * 0.20 +
    eventsScore * 0.15 +
    pledgesScore * 0.15 +
    responsivenessScore * 0.10;

  // Bayesian smoothing with k = 10 (pull toward city average)
  const K_LEADER = 10;
  const smoothedScore =
    (totalAdopted / (totalAdopted + K_LEADER)) * rawScore +
    (K_LEADER / (totalAdopted + K_LEADER)) * cityMean;

  // Minimum 3 confirmed resolutions in 90 days required for public rank
  const hasEnoughData = confirmedResolutions90d >= 3;

  return {
    impactScore,
    reliabilityScore,
    eventsScore,
    pledgesScore,
    responsivenessScore,
    rawScore: Math.round(rawScore * 10) / 10,
    smoothedScore: Math.round(smoothedScore * 10) / 10,
    resolvedIn90dCount: confirmedResolutions90d,
    monthlyResolutionsCapped: Math.min(MAX_RESOLUTIONS_PER_MONTH, confirmedResolutions90d),
    hasEnoughData,
  };
}
