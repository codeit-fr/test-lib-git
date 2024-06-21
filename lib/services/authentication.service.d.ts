import { ReplaySubject } from "rxjs";
import { User } from "firebase/auth";
import { SystemService } from "./system.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import * as i0 from "@angular/core";
/**
 * A service to manage authentication
 */
export declare class AuthenticationService {
    private systemService;
    private router;
    private route;
    private location;
    currentUser$: ReplaySubject<User | null>;
    isLoggedIn: ReplaySubject<boolean>;
    private firebaseAuthEmulatorPort;
    private auth;
    /**
     * constructor
     */
    constructor(systemService: SystemService, router: Router, route: ActivatedRoute, location: Location);
    /**
     * Called when a user signs in
     */
    private onSignIn;
    private onSignOut;
    /**
     * Sign in on Firebase for the given user/password
     * @param email
     * @param password
     * @returns
     */
    login(email: string, password: string): Promise<User>;
    /**
     * Login with google
     * @returns
     */
    loginWithGoogleAsync(): Promise<User>;
    /**
     * Call on logout
     */
    logout(): Promise<void>;
    /**
     * Navigate to login page
     */
    navigateToLogin(): void;
    signup(email: string, password: string): Promise<User>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthenticationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthenticationService>;
}
