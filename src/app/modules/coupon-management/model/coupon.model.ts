export interface Coupon {
  _id?: string;
  couponCode: string;
  discount: {
    discountType: string;
    value: number;
  };
  startDate: string;
  endDate: string;
  numberOfCoupons: number;
  availableCount: number;
  minPurchaseValue: number;
  maxPurchaseValue: number;
  useType: string;
  useCount: number;
  couponApplicable: string;
  isUnlimited: boolean;
  isActive: boolean;
  deActivated: boolean;
  isDeleted: false;
  supportedPlans: Array<any>;
  groupId: Array<any>;
  supportedCountries: Array<Country>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  name: string;
  flag: string;
  iso3code: string;
  dial_code: string;
}
