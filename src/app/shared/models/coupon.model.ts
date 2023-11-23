export interface Coupon {
  id?: string;
  code: string;
  total: number;
  used: number;
  remaining: number;
  discountType: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}