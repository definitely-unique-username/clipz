import { UploadTask } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { UploadSnapshot } from "./upload-snapshot.model";

export interface UploadData {
    uploadTask: UploadTask;
    uploadSnapshot$: Observable<UploadSnapshot>;
}