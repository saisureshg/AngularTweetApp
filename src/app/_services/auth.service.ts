import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ReplaySubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //baseUrl: 'http://localhost:5000/tweetapp/';
  baseUrl: 'https://tweetapplicationusecase.azurewebsites.net/tweetapp/';
  // jwtHelper = new JwtHelperService();
  decodedToken: any;


  constructor(private http: HttpClient,  private toastr: ToastrService) { }
  login(model: any) {    
    //return this.http.post('http://localhost:5000/tweetapp/login', model).pipe(
      return this.http.post('https://tweetapplicationusecase.azurewebsites.net/tweetapp/login', model).pipe(
      map((response: any) => {
        if (response == "Login Id is incorrect..!!") {
          this.toastr.error(response);
        }
        else if (response == "Password is incorrect..!!") {
          this.toastr.error(response);
        }
        else {
          // console.log("Error:::",response);
          const user = response;

          if (user) {
            localStorage.setItem('token', user);
            this.decodedToken = localStorage.getItem('token');

            console.log(this.decodedToken);
          }
        }
      })
    );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    if (token != null) {
      // this.currentUserSource.next(user)
      return true;

    }
    else {
      return false;
    }
  }

}



// return this.http.post(this.baseUrl /*'https://mytweetapi.azurewebsites.net/tweetapp/login/user'*/, model).pipe(