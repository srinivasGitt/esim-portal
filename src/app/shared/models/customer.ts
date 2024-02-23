export class Customer {
  public _id?: string;
  public userCount?: number;
  public createdAt?: string;
  public isActive?: boolean;
  public completeAddress?: string;
  constructor(
    public name: string,
    public websiteLink: string,
    public billingAddress: {
      addressLine: string;
      landmark: string;
      pincode: string;
      city: string;
      state: string;
      country: string;
    },
    public contactDetails: {
      emailAddress: string;
      phoneNumber: string;
    },
    public products: {
      iosApp: boolean;
      androidApp: boolean;
      api: boolean;
      trs: boolean;
      sdk: boolean;
      webapp: boolean;
      shopifyApp: boolean;
    },
    public userInvite: {
      firstName: string;
      lastName: string;
      email: string;
      number: string;
      role: string;
    }
  ) {}
}
