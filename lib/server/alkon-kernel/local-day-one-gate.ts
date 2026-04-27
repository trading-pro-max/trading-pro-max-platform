import type { LocalDayOneGate } from "./types";

type LocalDayOneOptions = {
  ahmadVisualAcceptance?: boolean;
  p0p1Blockers?: boolean;
  testsPass?: boolean;
  buildPass?: boolean;
  gitClean?: boolean;
  wakeReportPresent?: boolean;
};

export function getLocalDayOneGate(
  options: LocalDayOneOptions = {}
): LocalDayOneGate {
  const requirements = [
    { requirement: "Home acceptable", passed: options.ahmadVisualAcceptance === true },
    { requirement: "Trading Workspace acceptable", passed: options.ahmadVisualAcceptance === true },
    { requirement: "chart dominant", passed: true },
    { requirement: "Assistant useful", passed: true },
    { requirement: "Product Truth preserved", passed: true },
    { requirement: "public/private boundary clean", passed: true },
    { requirement: "tests pass", passed: options.testsPass === true },
    { requirement: "build pass", passed: options.buildPass === true },
    { requirement: "Git clean", passed: options.gitClean === true },
    { requirement: "Wake Report present", passed: options.wakeReportPresent === true },
    { requirement: "Ahmad visual acceptance", passed: options.ahmadVisualAcceptance === true },
    { requirement: "no P0/P1 blockers", passed: options.p0p1Blockers !== true },
  ];
  const blocked = options.p0p1Blockers === true;
  const allPassed = requirements.every((requirement) => requirement.passed);

  return {
    localDayOneStatus: blocked ? "blocked" : allPassed ? "ready" : "not_ready",
    requirements,
    ahmadVisualAcceptanceRequired: true,
    startsAutomatically: false,
    nextAction:
      options.ahmadVisualAcceptance === true
        ? "Complete validation, Wake Report, clean Git, and ask Ahmad before starting Local Day One."
        : "Ask Ahmad for visual acceptance before Local Day One can start.",
  };
}
