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
  customer: Customer;
  productId: number;
  reviewMessage: string;
  reviewRating: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type ReviewData = {
  productId: number | string;
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
  orderPhoneNumber: string;
  orderPostIndex: string;
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

export type OrderError = {
  emailError: string;
  firstNameError: string;
  lastNameError: string;
  cityError: string;
  addressError: string;
  postIndexError: string;
  phoneNumberError: string;
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
  customerEmail: string | undefined;
  customerName: string | undefined;
  customerPassword: string | undefined;
  customerPhoneNumber: string | undefined;
  customerAddress: string | undefined;
  customerRole: string | undefined;
};

export type CustomerEditErrors = {
  firstNameError: string;
  lastNameError: string;
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
