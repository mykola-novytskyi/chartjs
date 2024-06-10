export enum TimePeriodType {
  Today = 'today',
  Yesterday = 'yesterday',
  WeekToDate = 'wtd',
  MonthToDate = 'mtd',
  TwoMonthToDate = '2mtd',
  ThreeMonthToDate = '3mtd',
  YearToDate = 'ytd',
  CustomPeriod = 'custom',
}

export enum TimePeriodText {
  today = 'Today',
  yesterday = 'Yesterday',
  wtd = '7 days',
  mtd = '30 days',
  '2mtd' = '60 days',
  '3mtd' = '90 days',
  ytd = '365 days',
  custom = 'Custom period',
}
