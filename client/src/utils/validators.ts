/**
 * Funções de validação para o formulário de cadastro
 */

// Validar nome completo
export const validateFullName = (name: string): boolean => {
  if (!name || name.trim().length === 0) return false;

  // Apenas letras, espaços e acentos permitidos
  const nameRegex = /^[a-záàâãéèêíïóôõöúçñ\s]+$/i;
  if (!nameRegex.test(name)) return false;

  // Mínimo 5 caracteres
  if (name.length < 5) return false;

  // Máximo 100 caracteres
  if (name.length > 100) return false;

  // Exigir pelo menos nome e sobrenome
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return false;

  return true;
};

// Validar e-mail
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length > 0;
};

// Validar CPF usando algoritmo oficial
export const validateCPF = (cpf: string): boolean => {
  // Remove formatação
  const cleanCPF = cpf.replace(/\D/g, "");

  // Deve ter 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Bloquear CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validar primeiro dígito verificador
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cleanCPF.substring(9, 10), 10)) return false;

  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cleanCPF.substring(10, 11), 10)) return false;

  return true;
};

// Validar telefone brasileiro
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, "");

  // Deve ter 11 dígitos
  if (cleanPhone.length !== 11) return false;

  // Validar DDD (11 a 99)
  const areaCode = parseInt(cleanPhone.substring(0, 2), 10);
  if (areaCode < 11 || areaCode > 99) return false;

  // Verificar padrão geral
  return true;
};

// Validar força de senha
export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  strength: "weak" | "medium" | "strong";
  errors: string[];
} => {
  const errors: string[] = [];

  // Mínimo 8 caracteres
  if (password.length < 8) {
    errors.push("Mínimo 8 caracteres");
  }

  // Pelo menos 1 letra maiúscula
  if (!/[A-Z]/.test(password)) {
    errors.push("Pelo menos 1 letra maiúscula");
  }

  // Pelo menos 1 letra minúscula
  if (!/[a-z]/.test(password)) {
    errors.push("Pelo menos 1 letra minúscula");
  }

  // Pelo menos 1 número
  if (!/[0-9]/.test(password)) {
    errors.push("Pelo menos 1 número");
  }

  // Pelo menos 1 caractere especial
  if (!/[!@#$%&*()_+\-=]/.test(password)) {
    errors.push("Pelo menos 1 caractere especial (!@#$%&*()_+=-) ");
  }

  const isValid = errors.length === 0;

  // Determinar força da senha
  let strength: "weak" | "medium" | "strong" = "weak";
  if (isValid) {
    if (password.length >= 12) {
      strength = "strong";
    } else if (password.length >= 10) {
      strength = "medium";
    }
  }

  return { isValid, strength, errors };
};

// Validar confirmação de senha
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): boolean => {
  return password === confirmPassword && password.length > 0;
};
