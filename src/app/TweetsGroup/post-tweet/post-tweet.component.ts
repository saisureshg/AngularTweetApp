import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-tweet',
  templateUrl: './post-tweet.component.html',
  styleUrls: ['./post-tweet.component.css']
})
export class PostTweetComponent implements OnInit {

  dateFormat:any;
  tweetData='';
  userName:any;
  // baseUrl:any='https://mytweetapi.azurewebsites.net/tweetapp/';
  // baseUrl:'http://localhost:5000/tweetapp/';
  userData:any;
  mockTweet:any=[];

  constructor(private http:HttpClient, private toastr:ToastrService, private router: Router) { }

  ngOnInit(): void {

    this.userName=localStorage.getItem('token');
    console.log(this.userName);
   // let userNameUrl='http://localhost:5000/tweetapp/'+"fetchUserDetails/"+this.userName;
    let userNameUrl='https://tweetapplicationusecase.azurewebsites.net/tweetapp/'+"fetchUserDetails/"+this.userName;

    console.log(userNameUrl);
    this.http.get(userNameUrl).subscribe(result=>{
      this.userData=result;
      console.log("UserData:",this.userData);
    })
  }


  postTweet(){
    let dateTime = new Date().getTime();
    this.dateFormat=formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en').toString();
    this.mockTweet=[]
    this.mockTweet=
      {
        "createdOn":this.dateFormat,
        "body":this.tweetData,
        "postedBy":"",
        "loginId":this.userName,
        "likes":[],
        "replies":[]
   
      }
    
    //let postTweetUrl='http://localhost:5000/tweetapp/'+'tweets/tweet'
    let postTweetUrl='https://tweetapplicationusecase.azurewebsites.net/tweetapp/'+'tweets/tweet'
    
    this.http.post(postTweetUrl,this.mockTweet).subscribe(result=>
      {
        this.toastr.success('Tweet Posted Successfully!!!')
        
        this.router.navigate(['/all-tweets']);
      },
      error=>{
        this.toastr.error('Cannot Post Tweet due to some technical error');
      })
    this.tweetData='';
    
    console.log("tweet-data:::",this.mockTweet);
    
  }
}
