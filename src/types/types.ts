import { FC, FunctionComponent, ReactElement } from 'react';

export type Product = {
  id: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productMinimumEA: number;
  productImageFilepath: string;
  productRating: number;
  productRatingCount: number;
  reviews: Array<Review>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type ProductErrors = {
  productNameError: string;
  productDescriptionError: string;
  productPriceError: string;
  productMinimumEAError: string;
  productImageFileError: string;
  customerRoleError: string;
};

export type Customer = {
  id: number;
  customerEmail: string;
  customerName: string;
  customerPassword: string;
  customerPhoneNumber: string;
  customerPostIndex: string;
  customerAddress: string;
  customerAddressDetail: string;
  signupVerifyToken: string | null;
  customerRole: string;
  orders: Array<string>;
  reviews: Array<string>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type Review = {
  id: number;
  author: string;
  productId: number;
  reviewMessage: string;
  reviewRating: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ReviewData = {
  customerId: number | undefined;
  productId: number;
  author: string;
  message: string;
  rating: number;
};

export type ReviewError = {
  authorError: string;
  messageError: string;
  ratingError: string;
};

export type Order = {
  id: number;
  orderTotalPrice: number;
  orderCustomerName: string;
  orderAddress: string;
  orderAddressDetail: string;
  orderMemo: string;
  orderPhoneNumber: string;
  orderPostIndex: string;
  orderStatus: string;
  orderIsPaid: boolean;
  orderItems: Array<OrderItem>;
  createdAt: string;
};

export type OrderItem = {
  id: number;
  product: Product;
  orderItemEA: number;
  orderItemTotalPrice: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type InsertOrder = {
  customerId: number;
  orderCustomerName: string | undefined;
  orderPostIndex: string | undefined;
  orderAddress: string | undefined;
  orderAddressDetail: string | undefined;
  orderPhoneNumber: string | undefined;
  orderMemo: string | undefined;
  orderTotalPrice: number;
  cart: CartItem[];
};

export type OrderError = {
  orderCustomerNameError: string;
  orderPostIndexError: string;
  orderAddressError: string;
  orderAddressDetailError: string;
  orderPhoneNumberError: string;
};

export type CustomerRegistration = {
  customerEmail: string;
  customerName: string;
  customerPhoneNumber: string;
  customerPassword: string;
  customerPassword2: string;
  captcha: string | null;
  verifyNumber: string | null;
};

export type RegistrationEmailData = {
  from: string;
  to: string;
  title: string;
  customerName: string;
};

export type CustomerPasswordConfirmData = {
  customerEmail: string | undefined;
  customerPassword: string;
};

export type CustomerResetPasswordData = {
  email: string | undefined;
  password: string;
  password2: string;
};

export type AuthErrors = {
  captchaError: string;
  emailError: string;
  nameError: string;
  phoneNumberError: string;
  passwordError: string;
  password2Error: string;
};

export type FilterParamsType = {
  perfumers: Array<string>;
  genders: Array<string>;
  prices: Array<number>;
  sortByPrice?: boolean;
};

export type PerfumePrice = {
  id: number;
  name: string;
  array: Array<number>;
};

export type BrandType = {
  name: string;
  url: string;
};

export type PostCodeObject = {
  zonecode: string;
  jibunAddress: string;
  roadAddress: string;
  userSelectedType: string;
  addressType: string;
};

export type CustomerEdit = {
  id: number | undefined;
  newCustomerEmail: string | undefined;
  newCustomerName: string | undefined;
  newCustomerPhoneNumber: string | undefined;
  newCustomerPostIndex: string | undefined;
  newCustomerAddress: string | undefined;
  newCustomerAddressDetail: string | undefined;
  // customerRole: string | undefined;
};

export type CustomerEditErrors = {
  emailError: string;
  nameError: string;
  addressError: string;
  phoneNumberError: string;
  postIndexError: string;
};

export type CustomerData = {
  customerEmail: string;
  customerPassword: string;
};

export type CartItem = {
  id: number;
  customerId: number;
  customer: Customer;
  productId: number;
  product: Product;
  productCount: number;
};

export type FCinLayout<P = {}> = FC<P> & {
  getLayout: (page: ReactElement) => JSX.Element;
};
