import { Injectable } from '@angular/core';
import { DocumentReference, Firestore, where, getDocs, query, QuerySnapshot, QueryDocumentSnapshot, doc, updateDoc, getDoc, DocumentSnapshot, deleteDoc, orderBy } from '@angular/fire/firestore';
import { Storage, getDownloadURL, StorageReference, deleteObject } from '@angular/fire/storage';
import { collection, CollectionReference, addDoc } from '@angular/fire/firestore';
import { first, from, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { Clip, UploadData, UploadSnapshot } from './util';
import { AuthService } from './auth.service';
import { FirebaseUser, Sort } from '@clipz/util';
import { StorageEntity } from './storage-entity';

@Injectable({
  providedIn: 'root'
})
export class ClipsService extends StorageEntity {
  protected readonly backetName: string = 'clips';
  protected readonly collectionName: string = 'clips';
  protected readonly collection: CollectionReference<Clip> = collection(
    this.firestore,
    this.collectionName
  ) as CollectionReference<Clip>;

  constructor(
    private readonly firestore: Firestore,
    storage: Storage,
    private readonly authService: AuthService,
    private readonly auth: AuthService
  ) {
    super(storage);
  }

  public createClip(fileName: string, title: string, timestamp: number, file: File): UploadData {
    const storageRef: StorageReference = this.storageRef(fileName);
    const uploadData: UploadData = super.upload(fileName, file);

    return {
      ...uploadData,
      uploadSnapshot$: uploadData.uploadSnapshot$.pipe(
        withLatestFrom(this.authService.user$.pipe(first(Boolean))),
        switchMap(([snapshot, user]: [UploadSnapshot, FirebaseUser]) => {
          return snapshot.state === 'success'
            ? from(getDownloadURL(storageRef)).pipe(
              switchMap((url: string) => {
                return from(addDoc(this.collection, {
                  uid: user.uid,
                  displayName: `${user.displayName}`,
                  title,
                  fileName,
                  url,
                  timestamp
                } as Clip));
              }),
              map((docRef: DocumentReference) => ({ ...snapshot, uuid: docRef.id }))
            )
            : of(snapshot);
        })
      )
    }
  }

  public getUserClips(sort: Sort = Sort.DESC): Observable<Clip[]> {
    console.log('get', sort)
    return this.auth.user$.pipe(
      first(Boolean),
      switchMap((user: FirebaseUser) => {
        return from(
          getDocs(query(this.collection, where('uid', '==', user.uid), orderBy('timestamp', sort)))
        ).pipe(
          map((snapshot: QuerySnapshot<Clip>) => snapshot.docs.map((doc: QueryDocumentSnapshot<Clip>) => ({
            ...doc.data(),
            id: doc.id,
          })))
        );
      })
    )
  }

  public updateClip(id: string, changes: Partial<Clip>): Observable<Clip> {
    const docRef: DocumentReference<Clip> = this.docRef(id);

    return from(updateDoc(docRef, changes)).pipe(
      switchMap(() => from(getDoc(docRef))),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map((snapshot: DocumentSnapshot<Clip>) => ({ ...snapshot.data()!, id: snapshot.id }))
    );
  }

  public deleteClip(id: string, fileName: string): Observable<void> {
    const docRef: DocumentReference<Clip> = this.docRef(id);
    const storageRef: StorageReference = this.storageRef(fileName);

    return from(deleteDoc(docRef)).pipe(
      switchMap(() => from(deleteObject(storageRef)))
    );
  }

  private docRef(id: string): DocumentReference<Clip> {
    return doc(this.collection, id);
  }
}
