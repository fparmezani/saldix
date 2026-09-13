import { NextRequest, NextResponse } from 'next/server';

const SERIES = { ipca: 433, selic: 4390, cdi: 4391 } as const;

function toBcbDate(month: string, endOfMonth = false) {
  const [year, monthNumber] = month.split('-').map(Number);
  const day = endOfMonth ? new Date(year, monthNumber, 0).getDate() : 1;
  return `${String(day).padStart(2, '0')}/${String(monthNumber).padStart(2, '0')}/${year}`;
}

export async function GET(request: NextRequest) {
  const index = request.nextUrl.searchParams.get('index') as keyof typeof SERIES | null;
  const start = request.nextUrl.searchParams.get('start') ?? '';
  const end = request.nextUrl.searchParams.get('end') ?? '';
  if (
    !index ||
    !(index in SERIES) ||
    !/^\d{4}-\d{2}$/.test(start) ||
    !/^\d{4}-\d{2}$/.test(end) ||
    start > end
  ) {
    return NextResponse.json({ error: 'Informe índice e período válidos.' }, { status: 400 });
  }
  const url = new URL(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${SERIES[index]}/dados`);
  url.searchParams.set('formato', 'json');
  url.searchParams.set('dataInicial', toBcbDate(start));
  url.searchParams.set('dataFinal', toBcbDate(end, true));
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('BCB indisponível');
    const values = (await response.json()) as Array<{ data: string; valor: string }>;
    const rates = values
      .map((item) => Number(item.valor.replace(',', '.')))
      .filter(Number.isFinite);
    if (rates.length === 0)
      return NextResponse.json(
        { error: 'O índice ainda não possui dados nesse período.' },
        { status: 404 },
      );
    return NextResponse.json({ index, series: SERIES[index], rates, values });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível consultar o Banco Central agora.' },
      { status: 502 },
    );
  }
}
