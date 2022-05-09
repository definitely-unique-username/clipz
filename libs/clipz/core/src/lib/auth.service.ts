import { Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, user, UserCredential, signInWithEmailAndPassword, signOut , updateProfile} from "@angular/fire/auth";
import { FirebaseUser, User } from "@clipz/util";
import { from, map, mapTo, Observable, switchMap, switchMapTo } from "rxjs";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public readonly auth$: Observable<boolean> = user(this.auth).pipe(map(Boolean));

    constructor(
        private readonly auth: Auth,
        private readonly userService: UserService
    ) {
    }

    public createUser(user: User, password: string): Observable<UserCredential> {
        return this.createUserWithEmailAndPassword(user.email, password).pipe(
            switchMap((credential: UserCredential) => {
                return this.userService.createUser(credential.user.uid, user).pipe(
                    switchMapTo(this.updateProfile(credential.user, user.name)),
                    mapTo(credential)
                );
            })
        );
    }

    public login(email: string, password: string): Observable<UserCredential> {
        return this.signInWithEmailAndPassword(email, password);
    }

    public logout(): Observable<void> {
        return from(signOut(this.auth));
    }

    private createUserWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
        return from(createUserWithEmailAndPassword(this.auth, email, password));
    }

    private updateProfile(user: FirebaseUser, displayName: string): Observable<void> {
        return from(updateProfile(user, { displayName }));
    }

    private signInWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
        return from(signInWithEmailAndPassword(this.auth, email, password));
    }
}