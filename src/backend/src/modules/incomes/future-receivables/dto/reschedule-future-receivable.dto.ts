import { Matches } from 'class-validator';

export class RescheduleFutureReceivableDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'newExpectedDate must be in YYYY-MM-DD format' })
  newExpectedDate!: string;
}
