import { classifyAlKawnCommand } from "./command-classifier";
import type { AlKawnCommandClassification } from "./types";

export function getCommandExecutionVerdict(
  commandText: string,
): AlKawnCommandClassification {
  return classifyAlKawnCommand(commandText);
}
