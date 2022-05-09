import { User as FbUser } from '@angular/fire/auth'

export interface User {
    name: string;
    email: string;
    age: number;
    phoneNumber: string;
}

export type FirebaseUser = FbUser;