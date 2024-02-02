export enum otpType {
    enable_product = 'enable product',
    disable_product = 'disable product',
    enable_customer = 'enable customer',
    disable_customer = 'disable customer',
    enable_agent = 'enable agent',
    disable_agent = 'disable agent',
    delete_product_trs = 'delete product trs'
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