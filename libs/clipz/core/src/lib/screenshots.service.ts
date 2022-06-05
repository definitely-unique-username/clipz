import { Injectable } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { StorageEntity } from './storage-entity';

@Injectable({
  providedIn: 'root'
})
export class ScreenshotsService extends StorageEntity {
  protected readonly backetName: string = 'screenshots';

  constructor(storage: Storage) {
    super(storage);
  }
}
