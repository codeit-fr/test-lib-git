import { Injectable } from '@angular/core';
import { ReplaySubject } from "rxjs";
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import * as i0 from "@angular/core";
import * as i1 from "./system.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/common";
const LOGIN_ROUTE = "/home/login";
/**
 * A service to manage authentication
 */
export class AuthenticationService {
    /**
     * constructor
     */
    constructor(systemService, router, route, location) {
        this.systemService = systemService;
        this.router = router;
        this.route = route;
        this.location = location;
        this.currentUser$ = new ReplaySubject(1);
        this.isLoggedIn = new ReplaySubject(1);
        // the port used when emulating Firebase auth service (only in local environment)
        this.firebaseAuthEmulatorPort = 9099;
        this.auth = getAuth();
        const configuration = this.systemService.getEnvironmentConfiguration().then((configuration) => {
            // in Local, we use Firebase emulator
            if (configuration.stage == 'local') {
                connectAuthEmulator(this.auth, `http://localhost:${this.firebaseAuthEmulatorPort}`, { disableWarnings: true });
            }
        });
        // register to Firebase auth user-state updates
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                this.onSignIn(user);
            }
            else {
                await this.onSignOut();
            }
        });
    }
    /**
     * Called when a user signs in
     */
    onSignIn(user) {
        this.currentUser$.next(user);
        this.isLoggedIn.next(true);
    }
    async onSignOut() {
        this.isLoggedIn.next(false);
        this.currentUser$.next(null);
        this.navigateToLogin();
    }
    /**
     * Sign in on Firebase for the given user/password
     * @param email
     * @param password
     * @returns
     */
    async login(email, password) {
        let credentials = null;
        try {
            credentials = await signInWithEmailAndPassword(this.auth, email, password);
        }
        catch (error) {
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
            throw ("Could not get credentials");
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
            return;
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
    async signup(email, password) {
        let credentials = null;
        try {
            credentials = await createUserWithEmailAndPassword(this.auth, email, password);
        }
        catch (error) {
            throw new Error(`Could not sign-up user with email: ${email}, ${error.message}`);
        }
        let user = credentials?.user;
        if (user == null) {
            throw new Error(`Could not sign-up user with email: ${email}`);
        }
        return credentials.user;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: AuthenticationService, deps: [{ token: i1.SystemService }, { token: i2.Router }, { token: i2.ActivatedRoute }, { token: i3.Location }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: AuthenticationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: AuthenticationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.SystemService }, { type: i2.Router }, { type: i2.ActivatedRoute }, { type: i3.Location }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aGVudGljYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbW1vbi1saWIvc3JjL2xpYi9zZXJ2aWNlcy9hdXRoZW50aWNhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFrQixhQUFhLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUVMLG1CQUFtQixFQUNuQiw4QkFBOEIsRUFDOUIsT0FBTyxFQUFFLGtCQUFrQixFQUMzQixrQkFBa0IsRUFDbEIsMEJBQTBCLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFFckQsTUFBTSxlQUFlLENBQUM7Ozs7O0FBS3ZCLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQztBQUVsQzs7R0FFRztBQUlILE1BQU0sT0FBTyxxQkFBcUI7SUFXaEM7O09BRUc7SUFDSCxZQUNVLGFBQTRCLEVBQzVCLE1BQWMsRUFDZCxLQUFxQixFQUNyQixRQUFrQjtRQUhsQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQWhCckIsaUJBQVksR0FBK0IsSUFBSSxhQUFhLENBQWMsQ0FBQyxDQUFDLENBQUM7UUFDN0UsZUFBVSxHQUEyQixJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRSxpRkFBaUY7UUFDekUsNkJBQXdCLEdBQVcsSUFBSSxDQUFDO1FBZTlDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFFdEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQzVGLHFDQUFx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Q0FBQztRQUM3QixJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFDRCxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDMUIsQ0FBQzs4R0E3SVUscUJBQXFCO2tIQUFyQixxQkFBcUIsY0FGcEIsTUFBTTs7MkZBRVAscUJBQXFCO2tCQUhqQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZmlyc3RWYWx1ZUZyb20sIFJlcGxheVN1YmplY3QgfSBmcm9tIFwicnhqc1wiO1xyXG5pbXBvcnQge1xyXG4gIEF1dGgsXHJcbiAgY29ubmVjdEF1dGhFbXVsYXRvcixcclxuICBjcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQsXHJcbiAgZ2V0QXV0aCwgR29vZ2xlQXV0aFByb3ZpZGVyLFxyXG4gIG9uQXV0aFN0YXRlQ2hhbmdlZCxcclxuICBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZCwgc2lnbkluV2l0aFBvcHVwLCBzaWduT3V0LFxyXG4gIFVzZXJcclxufSBmcm9tIFwiZmlyZWJhc2UvYXV0aFwiO1xyXG5pbXBvcnQgeyBTeXN0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vc3lzdGVtLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XHJcblxyXG5jb25zdCBMT0dJTl9ST1VURSA9IFwiL2hvbWUvbG9naW5cIjtcclxuXHJcbi8qKlxyXG4gKiBBIHNlcnZpY2UgdG8gbWFuYWdlIGF1dGhlbnRpY2F0aW9uXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBdXRoZW50aWNhdGlvblNlcnZpY2Uge1xyXG5cclxuICBwdWJsaWMgY3VycmVudFVzZXIkOiBSZXBsYXlTdWJqZWN0PFVzZXIgfCBudWxsPiA9IG5ldyBSZXBsYXlTdWJqZWN0PFVzZXIgfCBudWxsPigxKTtcclxuICBwdWJsaWMgaXNMb2dnZWRJbjogUmVwbGF5U3ViamVjdDxib29sZWFuPiA9IG5ldyBSZXBsYXlTdWJqZWN0KDEpO1xyXG5cclxuICAvLyB0aGUgcG9ydCB1c2VkIHdoZW4gZW11bGF0aW5nIEZpcmViYXNlIGF1dGggc2VydmljZSAob25seSBpbiBsb2NhbCBlbnZpcm9ubWVudClcclxuICBwcml2YXRlIGZpcmViYXNlQXV0aEVtdWxhdG9yUG9ydDogbnVtYmVyID0gOTA5OTtcclxuXHJcbiAgLy8gdGhlIEZpcmViYXNlIGF1dGggc2VydmljZSBpbnRlcmZhY2VcclxuICBwcml2YXRlIGF1dGghOiBBdXRoO1xyXG5cclxuICAvKipcclxuICAgKiBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3lzdGVtU2VydmljZTogU3lzdGVtU2VydmljZSxcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcclxuICAgIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uXHJcbiAgKSB7XHJcblxyXG4gICAgdGhpcy5hdXRoID0gZ2V0QXV0aCgpO1xyXG5cclxuICAgIGNvbnN0IGNvbmZpZ3VyYXRpb24gPSB0aGlzLnN5c3RlbVNlcnZpY2UuZ2V0RW52aXJvbm1lbnRDb25maWd1cmF0aW9uKCkudGhlbigoY29uZmlndXJhdGlvbikgPT4ge1xyXG4gICAgICAvLyBpbiBMb2NhbCwgd2UgdXNlIEZpcmViYXNlIGVtdWxhdG9yXHJcbiAgICAgIGlmIChjb25maWd1cmF0aW9uLnN0YWdlID09ICdsb2NhbCcpIHtcclxuICAgICAgICBjb25uZWN0QXV0aEVtdWxhdG9yKHRoaXMuYXV0aCwgYGh0dHA6Ly9sb2NhbGhvc3Q6JHt0aGlzLmZpcmViYXNlQXV0aEVtdWxhdG9yUG9ydH1gLCB7IGRpc2FibGVXYXJuaW5nczogdHJ1ZSB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gcmVnaXN0ZXIgdG8gRmlyZWJhc2UgYXV0aCB1c2VyLXN0YXRlIHVwZGF0ZXNcclxuICAgIG9uQXV0aFN0YXRlQ2hhbmdlZCh0aGlzLmF1dGgsIGFzeW5jICh1c2VyOiBVc2VyIHwgbnVsbCkgPT4ge1xyXG4gICAgICBpZiAodXNlcikge1xyXG4gICAgICAgIHRoaXMub25TaWduSW4odXNlcilcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBhd2FpdCB0aGlzLm9uU2lnbk91dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBDYWxsZWQgd2hlbiBhIHVzZXIgc2lnbnMgaW5cclxuICAgKi9cclxuICBwcml2YXRlIG9uU2lnbkluKHVzZXI6IFVzZXIpIHtcclxuICAgIHRoaXMuY3VycmVudFVzZXIkLm5leHQodXNlcik7XHJcbiAgICB0aGlzLmlzTG9nZ2VkSW4ubmV4dCh0cnVlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgb25TaWduT3V0KCkge1xyXG4gICAgdGhpcy5pc0xvZ2dlZEluLm5leHQoZmFsc2UpO1xyXG4gICAgdGhpcy5jdXJyZW50VXNlciQubmV4dChudWxsKTtcclxuICAgIHRoaXMubmF2aWdhdGVUb0xvZ2luKClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gaW4gb24gRmlyZWJhc2UgZm9yIHRoZSBnaXZlbiB1c2VyL3Bhc3N3b3JkXHJcbiAgICogQHBhcmFtIGVtYWlsXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkXHJcbiAgICogQHJldHVybnNcclxuICAgKi9cclxuICBwdWJsaWMgYXN5bmMgbG9naW4oZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8VXNlcj4ge1xyXG4gICAgbGV0IGNyZWRlbnRpYWxzID0gbnVsbDtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNyZWRlbnRpYWxzID0gYXdhaXQgc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQodGhpcy5hdXRoLCBlbWFpbCwgcGFzc3dvcmQpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3Qgc2lnbi1pbiB1c2VyIHdpdGggZW1haWw6ICR7ZW1haWx9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHVzZXIgPSBjcmVkZW50aWFscz8udXNlcjtcclxuICAgIGlmICh1c2VyID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3Qgc2lnbi1pbiB1c2VyIHdpdGggZW1haWw6ICR7ZW1haWx9YCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY3JlZGVudGlhbHMudXNlcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIExvZ2luIHdpdGggZ29vZ2xlXHJcbiAgICogQHJldHVybnNcclxuICAgKi9cclxuICBhc3luYyBsb2dpbldpdGhHb29nbGVBc3luYygpIHtcclxuICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IEdvb2dsZUF1dGhQcm92aWRlcigpO1xyXG5cclxuICAgIGNvbnN0IGF1dGggPSBnZXRBdXRoKCk7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgc2lnbkluV2l0aFBvcHVwKGF1dGgsIHByb3ZpZGVyKTtcclxuXHJcbiAgICAvLyBUaGlzIGdpdmVzIHlvdSBhIEdvb2dsZSBBY2Nlc3MgVG9rZW4uIFlvdSBjYW4gdXNlIGl0IHRvIGFjY2VzcyB0aGUgR29vZ2xlIEFQSS5cclxuICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBHb29nbGVBdXRoUHJvdmlkZXIuY3JlZGVudGlhbEZyb21SZXN1bHQocmVzdWx0KTtcclxuXHJcbiAgICBpZiAoY3JlZGVudGlhbCA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IChcIkNvdWxkIG5vdCBnZXQgY3JlZGVudGlhbHNcIilcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0LnVzZXI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxsIG9uIGxvZ291dFxyXG4gICAqL1xyXG4gIGFzeW5jIGxvZ291dCgpIHtcclxuICAgIGNvbnN0IGF1dGggPSBnZXRBdXRoKCk7XHJcbiAgICBhd2FpdCBzaWduT3V0KGF1dGgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTmF2aWdhdGUgdG8gbG9naW4gcGFnZVxyXG4gICAqL1xyXG4gIG5hdmlnYXRlVG9Mb2dpbigpIHtcclxuICAgIC8vIFNraXAgdGhlIGFjdGlvbiBpZiBhbHJlYWR5IG9uIHRoZSBsb2dpbiBwYWdlICFcclxuICAgIGNvbnN0IHBhdGhXaXRob3V0UXVlcnkgPSB0aGlzLnJvdXRlci51cmwuc3BsaXQoJz8nKVswXTtcclxuICAgIGlmIChwYXRoV2l0aG91dFF1ZXJ5LmVuZHNXaXRoKCcvbG9naW4nKSB8fCBwYXRoV2l0aG91dFF1ZXJ5LmVuZHNXaXRoKCcvc2lnbnVwJykgfHwgcGF0aFdpdGhvdXRRdWVyeS5lbmRzV2l0aCgnL25vdC1mb3VuZCcpIHx8IHBhdGhXaXRob3V0UXVlcnkuZW5kc1dpdGgoJy9pbnZpdGF0aW9uJykpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yb3V0ZS5xdWVyeVBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcclxuXHJcbiAgICAgIGxldCByZWRpcmVjdFVybCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Jhc2UnKT8uZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJy8nO1xyXG4gICAgICByZWRpcmVjdFVybCArPSB0aGlzLmxvY2F0aW9uLnBhdGgoKTtcclxuXHJcbiAgICAgIGlmIChwYXJhbXNbJ3JlZGlyZWN0VXJsJ10pIHtcclxuICAgICAgICByZWRpcmVjdFVybCA9IHBhcmFtc1sncmVkaXJlY3RVcmwnXTtcclxuICAgICAgfVxyXG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IExPR0lOX1JPVVRFICsgJz9yZWRpcmVjdFVybD0nICsgcmVkaXJlY3RVcmw7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgc2lnbnVwKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPFVzZXI+IHtcclxuICAgIGxldCBjcmVkZW50aWFscyA9IG51bGw7XHJcbiAgICB0cnkge1xyXG4gICAgICBjcmVkZW50aWFscyA9IGF3YWl0IGNyZWF0ZVVzZXJXaXRoRW1haWxBbmRQYXNzd29yZCh0aGlzLmF1dGgsIGVtYWlsLCBwYXNzd29yZCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHNpZ24tdXAgdXNlciB3aXRoIGVtYWlsOiAke2VtYWlsfSwgJHtlcnJvci5tZXNzYWdlfWApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB1c2VyID0gY3JlZGVudGlhbHM/LnVzZXI7XHJcbiAgICBpZiAodXNlciA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHNpZ24tdXAgdXNlciB3aXRoIGVtYWlsOiAke2VtYWlsfWApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNyZWRlbnRpYWxzLnVzZXI7XHJcbiAgfVxyXG59XHJcbiJdfQ==