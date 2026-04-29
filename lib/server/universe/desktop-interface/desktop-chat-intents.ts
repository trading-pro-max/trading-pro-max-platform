import "server-only";

import type { AlKawnDesktopQuickAction } from "./types";

export function getAlKawnDesktopQuickActions(): AlKawnDesktopQuickAction[] {
  return [
    { id: "today_state", label: "حالتي اليوم", category: "safe", intent: "today_state", resultPreview: "أحمد، Product Truth محفوظ." },
    { id: "what_done", label: "ماذا أنجزت؟", category: "safe", intent: "done", resultPreview: "أحمد، أعرض آخر التقارير والإغلاقات." },
    { id: "what_needed", label: "ماذا تحتاج مني؟", category: "safe", intent: "needs", resultPreview: "أحمد، أفرز القرارات المنتظرة فقط." },
    { id: "pending_decision", label: "ما القرار المنتظر؟", category: "safe", intent: "decision", resultPreview: "أحمد، القرار النهائي يبقى عندك." },
    { id: "show_product_truth", label: "اعرض Product Truth", category: "safe", intent: "product_truth", resultPreview: "Product Truth overrides every action." },
    { id: "show_wake_report", label: "اعرض آخر WAKE REPORT", category: "safe", intent: "wake_report", resultPreview: "أحمد، أعرض أحدث حالة تحقق بدون ادعاء جديد." },
    { id: "show_gaps", label: "اعرض النواقص", category: "safe", intent: "gaps", resultPreview: "أحمد، أعرض النواقص غير الحساسة فقط." },
    { id: "show_tasks", label: "اعرض المهام", category: "safe", intent: "tasks", resultPreview: "أحمد، أرتب المهام الداخلية الآمنة." },
    { id: "show_appointments", label: "اعرض المواعيد", category: "safe", intent: "appointments", resultPreview: "Appointments are private and local-first." },
    { id: "show_reports", label: "اعرض التقارير", category: "safe", intent: "reports", resultPreview: "أحمد، أعرض تقارير المشروع المتاحة." },
    { id: "show_galaxy", label: "اعرض Pro Max Galaxy", category: "safe", intent: "galaxy", resultPreview: "Pro Max Galaxy is inside الكون." },
    { id: "show_earth", label: "اعرض Earth Planet", category: "safe", intent: "earth", resultPreview: "Earth Planet is the trading project." },
    { id: "show_trading", label: "اعرض /trading", category: "safe", intent: "trading", resultPreview: "/trading remains demo-safe/read-only." },
    { id: "check_kernel", label: "افحص النواة", category: "safe", intent: "kernel", resultPreview: "أحمد، النواة جاهزة." },
    { id: "check_protection", label: "افحص الحماية", category: "safe", intent: "protection", resultPreview: "أحمد، Protection Core checked." },
    { id: "check_architecture", label: "افحص المعمارية", category: "safe", intent: "architecture", resultPreview: "أحمد، أقرأ السجل المعماري canonical registry." },
    { id: "prepare_report", label: "جهّز تقرير", category: "safe", intent: "prepare_report", resultPreview: "أحمد، أجهز تقريرًا داخليًا غير حساس." },
    { id: "prepare_codex_mission", label: "جهّز مهمة Codex آمنة", category: "safe", intent: "prepare_mission", resultPreview: "أحمد، أجهز مهمة لا تكسر Product Truth." },
    { id: "legal", label: "القانون", category: "stop_gate", intent: "legal", resultPreview: "أحمد، هذا القرار يتعلق بالقانون ويحتاج توقفك." },
    { id: "money", label: "المال", category: "stop_gate", intent: "money", resultPreview: "أحمد، هذا القرار يتعلق بالمال ويحتاج توقفك." },
    { id: "payment", label: "الدفع", category: "stop_gate", intent: "payment", resultPreview: "Payment actions require Ahmad approval." },
    { id: "receiving_money", label: "استلام الأموال", category: "stop_gate", intent: "receiving_money", resultPreview: "Receiving funds requires Ahmad approval." },
    { id: "broker", label: "البروكر", category: "stop_gate", intent: "broker", resultPreview: "Broker actions require Ahmad approval." },
    { id: "real_trading", label: "التداول الحقيقي", category: "stop_gate", intent: "real_trading", resultPreview: "Real trading remains approval-gated and disabled." },
    { id: "final_name", label: "الاسم النهائي", category: "stop_gate", intent: "brand", resultPreview: "Brand adoption is stopped for Ahmad." },
    { id: "domain", label: "الدومين", category: "stop_gate", intent: "domain", resultPreview: "Domain purchase requires Ahmad approval." },
    { id: "external_accounts", label: "الحسابات الخارجية", category: "stop_gate", intent: "external_accounts", resultPreview: "External account connections require Ahmad approval." },
    { id: "public_universe", label: "public Universe", category: "blocked", intent: "public_universe", resultPreview: "أحمد، هذا الإجراء محجوب لأنه يخالف Product Truth." },
    { id: "public_alkon", label: "public ALKON", category: "blocked", intent: "public_alkon", resultPreview: "ALKON remains private/background." },
    { id: "secrets_git", label: "secrets in Git", category: "blocked", intent: "secrets_git", resultPreview: "Secrets are blocked from Git." },
    { id: "legal_claim", label: "legal approval claim", category: "blocked", intent: "legal_claim", resultPreview: "Legal approval claims are blocked while review is pending." },
    { id: "broker_without_approval", label: "broker execution without approval", category: "blocked", intent: "broker_without_approval", resultPreview: "Broker execution is blocked." },
    { id: "money_without_approval", label: "real-money trading without approval", category: "blocked", intent: "money_without_approval", resultPreview: "Real-money trading is disabled." },
  ];
}
