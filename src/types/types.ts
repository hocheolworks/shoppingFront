export type Perfume = {
  id: number;
  perfumeTitle: string;
  perfumer: string;
  year: number;
  country: string;
  type: string;
  volume: string;
  perfumeGender: string;
  fragranceTopNotes: string;
  fragranceMiddleNotes: string;
  fragranceBaseNotes: string;
  description: string;
  filename: string;
  price: number;
  perfumeRating: number;
  file: any;
  reviews: Array<Review>;
};

export type Product = {
  id: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productMinimumEA: number;
  productRating: number;
  productRatingCount: number;
  reviews: Array<Review>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type PerfumeErrors = {
  perfumeTitleError: string;
  perfumerError: string;
  yearError: string;
  countryError: string;
  typeError: string;
  volumeError: string;
  perfumeGenderError: string;
  fragranceTopNotesError: string;
  fragranceMiddleNotesError: string;
  fragranceBaseNotesError: string;
  priceError: string;
};

// export type Review = {
//     id: number;
//     author: string;
//     message: string;
//     rating: number;
//     date: any;
// };

export type Customer = {
  id: number;
  customerEmail: string;
  customerName: string;
  customerPassword: string;
  customerPhoneNumber: string;
  token: string | null;
  userRole: string;
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

// export type Order = {
//   id: number;
//   totalPrice: number;
//   date: string;
//   firstName: string;
//   lastName: string;
//   city: string;
//   address: string;
//   email: string;
//   phoneNumber: string;
//   postIndex: number;
//   orderItems: Array<OrderItem>;
// };

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

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  phoneNumber: string;
  postIndex: string;
  activationCode: string | null;
  passwordResetCode: string | null;
  active: boolean;
  provider: string;
  roles: Array<string>;
};

export type User2 = {
  id: number;
};

export type UserEdit = {
  id: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  city: string | undefined;
  address: string | undefined;
  phoneNumber: string | undefined;
  postIndex: string | undefined;
};

export type UserEditErrors = {
  firstNameError: string;
  lastNameError: string;
};

export type UserData = {
  email: string;
  password: string;
};

export type UserRegistration = {
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

export type UserResetPasswordData = {
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
