import Link from 'next/link';
import {
  BadgeDollarSign,
  Banknote,
  BriefcaseBusiness,
  CalendarClock,
  Calculator,
  CreditCard,
  House,
  Landmark,
  Percent,
  Scale,
  ShoppingCart,
  TrendingUp,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import { AppShell } from '@/shared/ui/AppShell';

interface CalculatorCard {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  available?: boolean;
}

const calculators: CalculatorCard[] = [
  {
    title: 'Meu Primeiro Milhão',
    description: 'Descubra quando você alcançará R$ 1 milhão ou quanto precisa investir por mês.',
    href: '/calculadoras/primeiro-milhao',
    icon: BadgeDollarSign,
    available: true,
  },
  {
    title: 'À vista ou parcelado',
    description: 'Compare o desconto à vista com o custo e o impacto de pagar em parcelas.',
    href: '/calculadoras/a-vista-ou-parcelado',
    icon: ShoppingCart,
    available: true,
  },
  {
    title: 'Quitação de dívidas',
    description: 'Simule aportes extras, prazo de quitação e quanto será economizado em juros.',
    href: '/calculadoras/quitacao-dividas',
    icon: CreditCard,
    available: true,
  },
  {
    title: 'Financiamento SAC × Price',
    description: 'Compare prestações, amortização, saldo devedor e juros dos dois sistemas.',
    href: '/calculadoras/financiamento',
    icon: Landmark,
    available: true,
  },
  {
    title: 'Amortização habitacional',
    description: 'Compare usar um valor extra para reduzir o prazo ou diminuir a prestação.',
    href: '/calculadoras/amortizacao-habitacional',
    icon: House,
    available: true,
  },
  {
    title: 'Juros compostos',
    description: 'Projete qualquer objetivo a partir do valor inicial, aportes, taxa e prazo.',
    href: '/calculadoras/juros-compostos',
    icon: Calculator,
    available: true,
  },
  {
    title: 'Inflação e poder de compra',
    description: 'Simule quanto algo pode custar no futuro e a perda estimada de poder de compra.',
    href: '/calculadoras/inflacao',
    icon: Percent,
    available: true,
  },
  {
    title: 'CLT ou PJ',
    description: 'Compare salário, impostos, férias, 13º, FGTS, PLR e todos os benefícios.',
    href: '/calculadoras/clt-ou-pj',
    icon: BriefcaseBusiness,
    available: true,
  },
  {
    title: 'Custo do cartão de crédito',
    description: 'Compare os juros do cartão com uma linha de crédito alternativa.',
    href: '/calculadoras/cartao-de-credito',
    icon: WalletCards,
    available: true,
  },
  {
    title: 'Comparador de investimentos',
    description: 'Compare rentabilidade, imposto, taxas e poder de compra de diferentes opções.',
    href: '/calculadoras/comparador-investimentos',
    icon: TrendingUp,
    available: true,
  },
  {
    title: 'Alugar ou comprar',
    description: 'Compare financiamento, aluguel e o custo de oportunidade da entrada.',
    href: '/calculadoras/alugar-ou-comprar',
    icon: House,
    available: true,
  },
  {
    title: 'Independência financeira',
    description: 'Calcule o patrimônio necessário para sustentar seu custo de vida.',
    href: '/calculadoras/independencia-financeira',
    icon: BadgeDollarSign,
    available: true,
  },
  {
    title: 'Estratégia para múltiplas dívidas',
    description: 'Compare os métodos avalanche e bola de neve para organizar quitações.',
    href: '/calculadoras/multiplas-dividas',
    icon: Scale,
    available: true,
  },
  {
    title: 'Salário líquido',
    description: 'Estime INSS, IRRF e o valor líquido mensal pelas tabelas de 2026.',
    href: '/calculadoras/salario-liquido',
    icon: Banknote,
    available: true,
  },
  {
    title: 'Correção de valores',
    description: 'Atualize valores por IPCA, Selic ou CDI usando dados do Banco Central.',
    href: '/calculadoras/correcao-valores',
    icon: Percent,
    available: true,
  },
  {
    title: 'Planejamento de aposentadoria',
    description: 'Projete patrimônio e renda para complementar o benefício previdenciário.',
    href: '/calculadoras/aposentadoria',
    icon: CalendarClock,
    available: true,
  },
];

export function CalculatorsPage() {
  return (
    <AppShell title="Calculadoras" greeting="Planeje suas decisões">
      <header className="mb-7 max-w-3xl">
        <p className="text-gray-300">
          Simule cenários antes de decidir. Os cálculos são informativos e não alteram seus dados
          financeiros.
        </p>
      </header>
      <section
        aria-label="Ferramentas disponíveis"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {calculators.map(({ title, description, icon: Icon, ...item }) => {
          const content = (
            <>
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-xl bg-brand/10 p-3 text-brand-light">
                  <Icon aria-hidden="true" size={24} />
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${item.available ? 'bg-brand/15 text-brand-light' : 'bg-surface text-gray-400'}`}
                >
                  {item.available ? 'Disponível' : 'Em breve'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
              </div>
              {item.available && (
                <span className="mt-auto text-sm font-semibold text-brand-light">
                  Abrir calculadora →
                </span>
              )}
            </>
          );
          return item.available ? (
            <Link
              key={title}
              href={item.href!}
              className="flex min-h-60 flex-col gap-5 rounded-xl2 border border-surface-border bg-surface-card p-6 transition hover:-translate-y-0.5 hover:border-brand focus-visible:border-brand"
            >
              {content}
            </Link>
          ) : (
            <article
              key={title}
              className="flex min-h-60 flex-col gap-5 rounded-xl2 border border-surface-border bg-surface-card p-6 opacity-75"
            >
              {content}
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
