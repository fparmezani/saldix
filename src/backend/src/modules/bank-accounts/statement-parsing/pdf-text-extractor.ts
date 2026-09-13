import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';

/**
 * Único ponto do domínio que conhece a lib `pdf-parse`. O resto do pipeline de
 * importação de fatura/extrato só lida com texto puro, nunca com a lib externa
 * diretamente — mesmo espírito do Adapter `VehiclePricingProvider` da Fase 7.
 */
@Injectable()
export class PdfTextExtractor {
  async extractText(buffer: Buffer): Promise<string> {
    const result = await pdfParse(buffer);
    return result.text;
  }
}
