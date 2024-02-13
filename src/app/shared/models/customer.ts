export class Customer {
  constructor(
    public companyName: string,
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
      ios: boolean;
      androidapplication: boolean;
      api: boolean;
      trs: boolean;
      sdk: boolean;
      webapplication: boolean;
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
