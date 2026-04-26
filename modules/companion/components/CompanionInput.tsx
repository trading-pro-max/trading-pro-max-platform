"use client";

type CompanionInputProps = {
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  value: string;
};

export default function CompanionInput({
  disabled = false,
  onChange,
  onSubmit,
  value,
}: CompanionInputProps) {
  return (
    <form
      className="tpm-companion-chat-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="tpm-companion-chat-field">
        <span>Ask safely</span>
        <textarea
          aria-label="Ask TPM Assistant"
          disabled={disabled}
          maxLength={320}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Tell TPM Assistant what you want: start, bigger chart, calmer workspace, plans, support, or why blocked."
          rows={2}
          value={value}
        />
      </label>
      <button type="submit" disabled={disabled || value.trim().length === 0}>
        Send
      </button>
    </form>
  );
}
