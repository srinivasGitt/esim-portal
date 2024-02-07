export enum otpType {
    CUSTOMER_PRODUCT_ENABLE = 'enable product',
    CUSTOMER_PRODUCT_DISABLE = 'disable product',
    CUSTOMER_UPDATE = 'edit customer',
    CUSTOMER_ENABLE = 'enable customer',
    CUSTOMER_DISABLE = 'disable customer',
    AGENT_ENABLE = 'enable agent',
    AGENT_DISABLE = 'disable agent',
}

export enum buttonText {
    enable = 'enable',
    disable = 'disable',
    delete = 'delete'
}
export interface OtpVerification {
    type: otpType,
    buttonText: buttonText
}