import { Injectable } from '@angular/core';
import { DocumentReference, Firestore } from '@angular/fire/firestore';
import { Storage, ref, UploadTask, uploadBytesResumable, UploadTaskSnapshot, getDownloadURL, StorageReference } from '@angular/fire/storage';
import { collection, CollectionReference, addDoc } from '@angular/fire/firestore';
import { first, from, map, Observable, of, Subscriber, switchMap, withLatestFrom } from 'rxjs';
import { Clip, UploadData, UploadSnapshot } from './util';
import { AuthService } from '@clipz/core';
import { FirebaseUser } from '@clipz/util';

@Injectable()
export class ClipsService {
  protected readonly backetName: string = 'clips';
  protected readonly collectionName: string = 'clips';
  protected readonly collection: CollectionReference<Clip> = collection(
    this.firestore,
    this.collectionName
  ) as CollectionReference<Clip>;

  constructor(
    private readonly firestore: Firestore,
    private readonly storage: Storage,
    private readonly authService: AuthService
  ) { }

  public upload(fileName: string, title: string, timestamp: number, file: File): UploadData {
    const path = `${this.backetName}/${fileName}`;
    const storageRef: StorageReference = ref(this.storage, path);
    const uploadTask: UploadTask = uploadBytesResumable(
      storageRef,
      new Blob([file], { type: file.type }),
      { contentType: file.type }
    );

    return {
      uploadTask,
      uploadSnapshot$: this.getUploadSnapshot(uploadTask, storageRef, title, timestamp, fileName)
    }
  }

  private getUploadSnapshot(uploadTask: UploadTask, storageRef: StorageReference, title: string, timestamp: number, fileName: string): Observable<UploadSnapshot> {
    return new Observable((subscriber: Subscriber<UploadSnapshot>) => {
      let snapshotCache: UploadSnapshot | null = null;
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          snapshotCache = {
            ...snapshot,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes),
          };
          subscriber.next(snapshotCache);
        },
        (error: Error) => {
          subscriber.error(error);
        },
        () => {
          if (snapshotCache) {
            snapshotCache = { ...snapshotCache, state: 'success', progress: 1 };
            subscriber.next(snapshotCache);
          }
          subscriber.complete();
        }
      );
    })
      .pipe(
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
                }));
              }),
              map((docRef: DocumentReference) => ({ ...snapshot, uuid: docRef.id }))
            )
            : of(snapshot);
        })
      );
  }
}
