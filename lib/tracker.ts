export const trackedAI = async (options: { feature: string; userId?: string; run: () => Promise<any> }) => {
  // Bypassing ai-cost-tracker SQLite initialization due to binding errors.
  return await options.run();
};


// import { initTracker, trackCosts } from "ai-cost-tracker";
// import path from "path";

// // Initialize the tracker with SQLite storage
// initTracker({
//   storagePath: path.resolve(process.cwd(), "cost-tracking.db"),
//   orgId: "devkit-ai",
// });

// export async function trackedAI(options: { feature: string; userId?: string; run: () => Promise<any> }) {
//   return trackCosts(options.run, {
//     feature: options.feature,
//     userId: options.userId || "demo-user",
//   });
// }
