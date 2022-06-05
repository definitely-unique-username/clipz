import { ref, Storage, StorageReference, uploadBytesResumable, UploadTask, UploadTaskSnapshot } from "@angular/fire/storage";
import { Observable, Subscriber } from "rxjs";
import { UploadData, UploadSnapshot } from "./util";

export abstract class StorageEntity {
    protected abstract readonly backetName: string;

    protected constructor(
        protected readonly storage: Storage,
      ) { }

      public upload(fileName: string, file: File): UploadData {
        const storageRef: StorageReference = this.storageRef(fileName);
        const uploadTask: UploadTask = uploadBytesResumable(
          storageRef,
          new Blob([file], { type: file.type }),
          { contentType: file.type }
        );
    
        return {
          uploadTask,
          uploadSnapshot$: this.getUploadSnapshot(uploadTask, storageRef)
        }
      }
    
    
      protected filePath(fileName: string): string {
        return `${this.backetName}/${fileName}`;
      }
    
      protected storageRef(fileName: string): StorageReference {
        return ref(this.storage, this.filePath(fileName));
      }
    
      protected getUploadSnapshot(uploadTask: UploadTask, storageRef: StorageReference): Observable<UploadSnapshot> {
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
        });
      }
}
