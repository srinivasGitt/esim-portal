export interface ClientConfig {
  cacheId: string;
  couponCodesMasterEnabled: boolean;
  currencyConversionMasterEnabled: boolean;
  multiLingualMasterEnabled: boolean;
  oneClickInstallMasterEnabled: boolean;
  rewardPointsEarning: number;
  rewardPointsMasterEnabled: boolean;
  rewardPointsEnabled: {
    purchaseValue: number,
    rewardPoints: number
  };
  rewardPointsMaxRedeem: number;
  rewardPointsMinRedeem: number;
  rewardPointsReferral: number;
  rewardPointsValue: {
    cashValue: number,
    rewardPoints: number
  };
  stripeEnableApplePay: boolean;
  stripeEnabled: boolean;
  stripeKey: string;
  topupPlansEnabled: boolean;
  topupPlansMasterEnabled: boolean;
}