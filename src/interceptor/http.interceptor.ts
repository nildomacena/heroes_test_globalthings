import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        const headers = new HttpHeaders({
            'accessKey': '6d32f413868a4327aab124190fa83b2c',
        });
        request = request.clone({ headers });
        return next.handle(request);
    }
}
