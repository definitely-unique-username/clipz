import { Injectable } from '@angular/core';
import { DocumentReference, Firestore, where, getDocs, query, QuerySnapshot, QueryDocumentSnapshot, doc, updateDoc, getDoc, DocumentSnapshot, deleteDoc, orderBy, limit, startAfter, Query, DocumentData } from '@angular/fire/firestore';
import { Storage, StorageReference, deleteObject } from '@angular/fire/storage';
import { collection, CollectionReference, addDoc } from '@angular/fire/firestore';
import { first, from, map, Observable, switchMap  } from 'rxjs';
import { Clip } from './util';
import { AuthService } from './auth.service';
import { DEFAULT_PAGE_SIZE, FirebaseUser, Sort } from '@clipz/util';
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

  public createClip(fileName: string, title: string, timestamp: number, fileUrl: string, imageName: string, imageUrl: string): Observable<string> {
    return this.authService.user$.pipe(
      first(Boolean),
      switchMap((user: FirebaseUser) => {
        return from(addDoc(this.collection, {
          uid: user.uid,
          displayName: `${user.displayName}`,
          title,
          fileName,
          url: fileUrl,
          timestamp,
          image: imageUrl,
          imageName
        } as Clip))
      }),
      map((docRef: DocumentReference) => docRef.id)
    );
  }

  public getUserClips(sort: Sort = Sort.DESC): Observable<Clip[]> {
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

  public getSnapshot(id: string): Observable<DocumentSnapshot<Clip>> {
    return from(getDoc(this.docRef(id)));
  }

  public getClips(lastSnapshot: DocumentSnapshot<Clip> | null = null, take: number = DEFAULT_PAGE_SIZE, sort: Sort = Sort.DESC): Observable<Clip[]> {
    const q: Query<Clip> = lastSnapshot
      ? query(this.collection, orderBy('timestamp', sort), startAfter(lastSnapshot), limit(take))
      : query(this.collection, orderBy('timestamp', sort), limit(take));

      return from(getDocs(q)).pipe(
      map((snapshot: QuerySnapshot<Clip>) => snapshot.docs),
      map((docs: QueryDocumentSnapshot<Clip>[]) => docs.map((d: QueryDocumentSnapshot<Clip>) => ({ ...d.data(), id: d.id })))
    );
  }

  public updateClip(id: string, changes: Partial<Clip>): Observable<Clip> {
    const docRef: DocumentReference<Clip> = this.docRef(id);

    return from(updateDoc(docRef, changes)).pipe(
      switchMap(() => this.getSnapshot(id)),
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
