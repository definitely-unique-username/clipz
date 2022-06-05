import { UploadTaskSnapshot } from "@angular/fire/storage";

export interface UploadSnapshot extends UploadTaskSnapshot {
    progress: number;
    uuid?: string;
    url?: string;
}