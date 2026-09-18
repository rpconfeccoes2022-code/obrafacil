/**
 * Formata uma string de dígitos (ex: "56936200", vindo do que o usuário digitou)
 * como moeda brasileira: "569.362,00". Os dois últimos dígitos são sempre os centavos.
 */
export function maskCurrencyDigits(digitsOnly: string): string {
  const clean = digitsOnly.replace(/\D/g, '')
  if (!clean) return ''
  const cents = clean.padStart(3, '0')
  const integerPart = cents.slice(0, -2).replace(/^0+(?=\d)/, '')
  const centsPart = cents.slice(-2)
  const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${withThousands},${centsPart}`
}

/** Converte "569.362,00" -> 569362.00 (number) */
export function currencyMaskToNumber(masked: string): number {
  if (!masked) return 0
  const normalized = masked.replace(/\./g, '').replace(',', '.')
  const value = Number(normalized)
  return Number.isNaN(value) ? 0 : value
}

/** Converte um number (ex: 569362.5) direto para o texto mascarado "569.362,50" */
export function numberToCurrencyMask(value: number): string {
  return maskCurrencyDigits(String(Math.round(value * 100)))
}

/** Formata um number para exibição "R$ 569.362,00" */
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

