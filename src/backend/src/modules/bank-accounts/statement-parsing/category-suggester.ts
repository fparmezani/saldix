export interface UserCategoryLite {
  id: string;
  name: string;
}

const KEYWORD_BUCKETS: Record<string, string[]> = {
  Transporte: ['uber', 'taxi', '99app', 'combustivel', 'posto ', 'ipiranga', 'shell'],
  Mercado: ['supermercado', 'mercado', 'atacad', 'carrefour', 'pao de acucar'],
  Delivery: ['ifood', 'rappi', 'delivery'],
  Lazer: ['cinema', 'ingresso', 'steam', 'playstation', 'xbox'],
  Assinaturas: ['netflix', 'spotify', 'amazon prime', 'hbo', 'disney'],
  Saude: ['farmacia', 'drogaria', 'droga', 'clinica', 'laboratorio'],
  Vestuario: ['renner', 'riachuelo', 'zara', 'c&a', 'centauro'],
  Educacao: ['udemy', 'alura', 'faculdade', 'escola', 'curso'],
  Casa: ['leroy', 'telhanorte', 'condominio', 'imobiliaria'],
};

const COMBINING_DIACRITICS = new RegExp('[̀-ͯ]', 'g');

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(COMBINING_DIACRITICS, '');
}

/**
 * Sugere uma categoria já existente do usuário com base em palavras-chave conhecidas
 * no texto do lançamento. Nunca inventa categoria nova — sem match no cadastro do
 * usuário, devolve null e a escolha fica manual na tela de revisão.
 */
export function suggestCategory(
  description: string,
  userCategories: UserCategoryLite[],
): string | null {
  const normalizedDesc = normalize(description);

  for (const [bucket, keywords] of Object.entries(KEYWORD_BUCKETS)) {
    const matched = keywords.some((keyword) => normalizedDesc.includes(normalize(keyword)));
    if (!matched) continue;

    const normalizedBucket = normalize(bucket);
    const category = userCategories.find((c) => normalize(c.name) === normalizedBucket);
    if (category) return category.id;
  }

  return null;
}
