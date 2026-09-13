'use client';

import { useEffect, useRef, useState, type InputHTMLAttributes } from 'react';

interface CurrencyInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type'
> {
  value: string | number;
  onValueChange: (value: string) => void;
}

function display(value: string | number) {
  return value === ''
    ? ''
    : Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CurrencyInput({
  value,
  onValueChange,
  min,
  step: _step,
  ...props
}: CurrencyInputProps) {
  const [draft, setDraft] = useState(() => display(value));
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!focused && !input.current?.validity.customError) setDraft(display(value));
  }, [value, focused]);
  return (
    <input
      {...props}
      ref={input}
      type="text"
      inputMode="decimal"
      placeholder="0,00"
      value={draft}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
      }}
      onChange={(event) => {
        const text = event.target.value.replace(/R\$\s*/g, '').trim();
        setDraft(text);
        const normalized = text.includes(',') ? text.replace(/\./g, '').replace(',', '.') : text;
        const valid =
          text === '' ||
          (/^-?\d+(\.\d{0,2})?$/.test(normalized) && Number.isFinite(Number(normalized)));
        const aboveMin = text === '' || min === undefined || Number(normalized) >= Number(min);
        event.target.setCustomValidity(
          !valid
            ? 'Informe um valor como 1.234,56.'
            : !aboveMin
              ? `O valor mínimo é ${display(String(min))}.`
              : '',
        );
        if (valid) onValueChange(normalized);
      }}
    />
  );
}
