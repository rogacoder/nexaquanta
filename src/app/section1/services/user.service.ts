import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// RS: Hardcoded env. For the Latest, use:  apiUrl = import.meta.env['apiUrl']
const environment = {
    apiUrl: 'https://api.example.com'
};

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // RS: Use inject() instead of the constructor for Modern Angular Pattern and treeshaking
    private http = inject(HttpClient);
    // An Argument could be used here to Modernize byemploy a 'Signal' (instead of a BehaviorSubject)
    // I personally favour the BehaviorSubject as it keeps service more Framework agnostic
    private userSubject = new BehaviorSubject<User | null>(null);

    getCurrentUser(): Observable<User> {
        // Example: add headers if needed (e.g., for auth)
        /* RS The question says "remove localStorage" - various ways we may want to get this value
        - if running on the client , it can be through Inject, or route data, 
        - or if running this server side in SSG or SSR, it will need a method to retrieve from the endpoints
        
        Local Storage has, simply, been ommited */

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.get<User>(`${environment.apiUrl}/user`, { headers })
            .pipe(
                tap(user => this.userSubject.next(user)),
                catchError(error => {
                    // RS:  Log and return a user-friendly error observable 
                    // Break this out into its own method for easier unit testing
                    console.error('Error fetching user:', error);
                    return throwError(() => new Error('Failed to fetch user. Please try again later.'));
                })
            );
    }

    /**
     * RS Update the current user.
     */
    updateUser(userData: Partial<User>): Observable<User> {
        return this.http.put<User>(`${environment.apiUrl}/user`, userData)
            .pipe(
                catchError(error => {
                    console.error('Error updating user:', error);
                    return throwError(() => new Error('Failed to update user. Please try again later.'));
                })
            );
    }
}

// RS: Adding a type for runtime
export type User = {
    id: number;
    name: string;
    email: string;
}