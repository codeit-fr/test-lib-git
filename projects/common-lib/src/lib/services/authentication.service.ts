import { Injectable } from '@angular/core';
import { firstValueFrom, ReplaySubject } from "rxjs";
import {
  Auth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth, GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword, signInWithPopup, signOut,
  User
} from "firebase/auth";
import { SystemService } from "./system.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

const LOGIN_ROUTE = "/home/login";

/**
 * A service to manage authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUser$: ReplaySubject<User | null> = new ReplaySubject<User | null>(1);
  public isLoggedIn: ReplaySubject<boolean> = new ReplaySubject(1);

  // the port used when emulating Firebase auth service (only in local environment)
  private firebaseAuthEmulatorPort: number = 9099;

  // the Firebase auth service interface
  private auth!: Auth;

  /**
   * constructor
   */
  public constructor(
    private systemService: SystemService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {

    this.auth = getAuth();

    const configuration = this.systemService.getEnvironmentConfiguration().then((configuration) => {
      // in Local, we use Firebase emulator
      if (configuration.stage == 'local') {
        connectAuthEmulator(this.auth, `http://localhost:${this.firebaseAuthEmulatorPort}`, { disableWarnings: true });
      }
    });

    // register to Firebase auth user-state updates
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        this.onSignIn(user)
      }
      else {
        await this.onSignOut();
      }
    });
  }


  /**
   * Called when a user signs in
   */
  private onSignIn(user: User) {
    this.currentUser$.next(user);
    this.isLoggedIn.next(true);
  }

  private async onSignOut() {
    this.isLoggedIn.next(false);
    this.currentUser$.next(null);
    this.navigateToLogin()
  }

  /**
   * Sign in on Firebase for the given user/password
   * @param email
   * @param password
   * @returns
   */
  public async login(email: string, password: string): Promise<User> {
    let credentials = null;
    try {
      credentials = await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw new Error(`Could not sign-in user with email: ${email}`);
    }

    let user = credentials?.user;
    if (user == null) {
      throw new Error(`Could not sign-in user with email: ${email}`);
    }
    return credentials.user;
  }

  /**
   * Login with google
   * @returns
   */
  async loginWithGoogleAsync() {
    const provider = new GoogleAuthProvider();

    const auth = getAuth();
    let result = await signInWithPopup(auth, provider);

    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (credential == null) {
      throw ("Could not get credentials")
    }

    return result.user;
  }

  /**
   * Call on logout
   */
  async logout() {
    const auth = getAuth();
    await signOut(auth);
  }

  /**
   * Navigate to login page
   */
  navigateToLogin() {
    // Skip the action if already on the login page !
    const pathWithoutQuery = this.router.url.split('?')[0];
    if (pathWithoutQuery.endsWith('/login') || pathWithoutQuery.endsWith('/signup') || pathWithoutQuery.endsWith('/not-found') || pathWithoutQuery.endsWith('/invitation')) {
      return
    }

    this.route.queryParams.subscribe(params => {

      let redirectUrl = document.querySelector('base')?.getAttribute('href') || '/';
      redirectUrl += this.location.path();

      if (params['redirectUrl']) {
        redirectUrl = params['redirectUrl'];
      }
      window.location.href = LOGIN_ROUTE + '?redirectUrl=' + redirectUrl;
    });

  }

  public async signup(email: string, password: string): Promise<User> {
    let credentials = null;
    try {
      credentials = await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      throw new Error(`Could not sign-up user with email: ${email}, ${error.message}`);
    }

    let user = credentials?.user;
    if (user == null) {
      throw new Error(`Could not sign-up user with email: ${email}`);
    }
    return credentials.user;
  }
}
