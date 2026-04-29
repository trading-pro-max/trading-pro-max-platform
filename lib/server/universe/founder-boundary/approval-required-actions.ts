import "server-only";
import { getNeverAloneActions } from "./never-alone-actions";

export function getApprovalRequiredActions() {
  return getNeverAloneActions();
}
