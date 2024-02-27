export enum otpType {
  CUSTOMER_PRODUCT_ENABLE = 'enable product',
  CUSTOMER_PRODUCT_DISABLE = 'disable product',
  CUSTOMER_UPDATE = 'edit customer',
  CUSTOMER_ENABLE = 'enable customer',
  CUSTOMER_DISABLE = 'disable customer',
  CUSTOMER_FEATURE_ENABLE = 'enable feature',
  CUSTOMER_FEATURE_DISABLE = 'disable feature',
  TRS_AGENT_ENABLE = 'enable agent',
  TRS_AGENT_DISABLE = 'disable agent',
}

export enum buttonText {
  enable = 'enable',
  disable = 'disable',
  delete = 'delete',
  submit = 'submit',
}
export interface OtpVerification {
  type: otpType;
  buttonText: buttonText;
}
