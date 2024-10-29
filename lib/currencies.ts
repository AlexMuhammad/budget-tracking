export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "GB", label: "£ Pound", locale: "en-GB" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "IDR", label: "Rp Rupiah", locale: "id-ID" },
];

export type Currency = (typeof Currencies)[0];
