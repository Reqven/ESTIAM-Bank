import {Address} from './address';

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: Address;
}
