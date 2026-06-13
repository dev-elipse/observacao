/**
 * Funções de máscara para campos do formulário
 */

// Máscara para CPF: 000.000.000-00
export const maskCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  const truncated = cleanValue.substring(0, 11);

  if (truncated.length <= 3) return truncated;
  if (truncated.length <= 6)
    return `${truncated.substring(0, 3)}.${truncated.substring(3)}`;
  if (truncated.length <= 9)
    return `${truncated.substring(0, 3)}.${truncated.substring(3, 6)}.${truncated.substring(6)}`;

  return `${truncated.substring(0, 3)}.${truncated.substring(3, 6)}.${truncated.substring(6, 9)}-${truncated.substring(9)}`;
};

// Máscara para telefone: (00) 00000-0000
export const maskPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  const truncated = cleanValue.substring(0, 11);

  if (truncated.length <= 2) return truncated.length > 0 ? `(${truncated}` : "";
  if (truncated.length <= 7)
    return `(${truncated.substring(0, 2)}) ${truncated.substring(2)}`;

  return `(${truncated.substring(0, 2)}) ${truncated.substring(2, 7)}-${truncated.substring(7)}`;
};

// Remover formatação
export const unMask = (value: string): string => {
  return value.replace(/\D/g, "");
};
