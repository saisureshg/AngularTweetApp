import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-individual-tweets-popup',
  templateUrl: './individual-tweets-popup.component.html',
  styleUrls: ['./individual-tweets-popup.component.css']
})
export class IndividualTweetsPopupComponent implements OnInit {

  individualTweets:any=[];
  userName:any;
  loginId: any;
  myTweets:any;
  replyData:any;
  replyTweetData:any=[];
  likeTweetData: any = [];

  constructor(private http: HttpClient, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data) {
    this.loginId = data.LoginId;
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('token');
    console.log(this.userName);
    this.getTweetsByLoginId(this.loginId);
    console.log(this.individualTweets);
  }

  
  getTweetsByLoginId(loginId:any){
    //let getTweetUrl='http://localhost:5000/tweetapp/' + 'tweets/' + loginId; 
    let getTweetUrl='https://tweetapplicationusecase.azurewebsites.net/tweetapp/' + 'tweets/' + loginId; 

    this.http.get(getTweetUrl).subscribe(result=>{
      this.individualTweets=result;
      console.log("Tweets of "+loginId+"::",this.individualTweets);
    })
  }

  replyTweet(replyId, replyData) {
    let dateTime = new Date().getTime();
    let dateFormat = formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en').toString();
    console.log("reply-data", replyData)
    this.replyTweetData =
    {
      "replyBody": replyData,
      "replyTimestamp": dateFormat,
      "repliedBy": '',
      'replyLoginId': this.userName,
      "tweetId": replyId
    }
    //let replyUrl = 'http://localhost:5000/tweetapp/' + 'postReply/reply'
    let replyUrl = 'https://tweetapplicationusecase.azurewebsites.net/tweetapp/' + 'postReply/reply'

    this.http.post(replyUrl, this.replyTweetData).subscribe(result => {
      this.toastr.success('You replied to the tweet')
      this.getTweetsByLoginId(this.loginId)
    })
    this.replyData = ''
    console.log("replied::", this.replyTweetData)
  }

  likeTweet(tweet) {
    let likedDetails = tweet?.likes?.find(like => like.likeLoginId == this.userName);
    if (!likedDetails) {
      let dateTime = new Date().getTime();
      let dateFormat = formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en').toString();
      console.log("likeTweet Id", tweet.id)
      this.likeTweetData =
      {
        "likeTimestamp": dateFormat,
        "likedBy": '',
        'likeLoginId': this.userName,
        "tweetId": tweet.id
      }
     // let likeTweetUrl = 'http://localhost:5000/tweetapp/' + 'tweets/likeTweet'
      let likeTweetUrl = 'https://tweetapplicationusecase.azurewebsites.net/tweetapp/' + 'tweets/likeTweet'

      this.http.post(likeTweetUrl, this.likeTweetData).subscribe(result => {
        this.toastr.success('You liked the tweet')
        this.getTweetsByLoginId(this.loginId);
      })
      this.likeTweetData = '';
      console.log("Liked::", this.likeTweetData);
    }
    else{
     // let unlikeTweetUrl = 'http://localhost:5000/tweetapp/' + 'tweets/dislikeTweet'
      let unlikeTweetUrl = 'https://tweetapplicationusecase.azurewebsites.net/tweetapp/' + 'tweets/dislikeTweet'

      this.http.post(unlikeTweetUrl, likedDetails).subscribe(result => {
        this.toastr.success('You disliked the tweet')
        this.getTweetsByLoginId(this.loginId);
      })
    }
  }
  
  isLiked(tweet) {
    if (tweet != null && tweet?.likes != undefined) {
      let liked = tweet?.likes?.find(like => like.likeLoginId == this.userName);
      return liked;
    }
    else {
      return false;
    }
  }
}
