import { Injectable } from '@angular/core';
import { collection, CollectionReference, DocumentData, Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '@clipz/util';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected readonly collectionName: string = 'users';
  protected readonly collectionRef: CollectionReference<DocumentData>  = collection(this.firestore, this.collectionName);

  constructor(
    private readonly firestore: Firestore
  ) {}

   public createUser(uid: string, user: User): Observable<void> { 
     return from(
       setDoc(doc(this.firestore, this.collectionName, uid), user)
     );
  }
}
