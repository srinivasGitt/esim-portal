export interface ClientConfig {
  cacheId?: string;
  couponCodesMasterEnabled?: boolean;
  currencyConversionMasterEnabled?: boolean;
  multiLingualMasterEnabled?: boolean;
  oneClickInstallMasterEnabled?: boolean;
  rewardPointsEarning?: {
    purchaseValue?: number;
    rewardPoints?: number;
  };
  rewardPointsEnabled?: boolean;
  rewardPointsMasterEnabled?: boolean;
  rewardPointsMaxRedeem?: number;
  rewardPointsMinRedeem?: number;
  rewardPointsReferral?: number;
  rewardPointsValue?: {
    cashValue?: number;
    rewardPoints?: number;
  };
  stripeEnableApplePay?: boolean;
  stripeEnabled?: boolean;
  stripeKey?: string;
  topupPlansEnabled?: boolean;
  topupPlansMasterEnabled?: boolean;
  message?: string | '';
}
