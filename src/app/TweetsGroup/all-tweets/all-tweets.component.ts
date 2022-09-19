import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-tweets',
  templateUrl: './all-tweets.component.html',
  styleUrls: ['./all-tweets.component.css']
})
export class AllTweetsComponent implements OnInit {

  userName: any;
  allTweets: any;
  replyData: any;
  replyTweetData: any = [];
  likeTweetData: any = [];

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('token');
    console.log(this.userName);
    //let getTweetUrl = 'http://localhost:5000/tweetapp/' + 'tweets'
    let getTweetUrl = 'https://tweetapplicationusecase.azurewebsites.net/tweetapp/' + 'tweets'
    this.http.get(getTweetUrl).subscribe(result => {
      this.allTweets = result;
      console.log("AllTweets::", this.allTweets);
    })
  }

  getAllTweets() {
    //let getTweetUrl = 'http://localhost:5000/tweetapp/' + 'tweets'
    let getTweetUrl = 'https://tweetapplicationusecase.azurewebsites.net/tweetapp/' + 'tweets'
    this.http.get(getTweetUrl).subscribe(result => {
      this.allTweets = result;

      console.log("AllTweets::", this.allTweets);
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
      this.getAllTweets()
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
      //let likeTweetUrl = 'http://localhost:5000/tweetapp/' + 'tweets/likeTweet'
      let likeTweetUrl = 'https://tweetapplicationusecase.azurewebsites.net/tweetapp/' + 'tweets/likeTweet'
      this.http.post(likeTweetUrl, this.likeTweetData).subscribe(result => {
        this.toastr.success('You liked the tweet')
        this.getAllTweets()
      })
      this.likeTweetData = '';
      console.log("Liked::", this.likeTweetData);
    }
    else{
      //let unlikeTweetUrl = 'http://localhost:5000/tweetapp/' + 'tweets/dislikeTweet'
      let unlikeTweetUrl = 'https://tweetapplicationusecase.azurewebsites.net/tweetapp/' + 'tweets/dislikeTweet'
      this.http.post(unlikeTweetUrl, likedDetails).subscribe(result => {
        this.toastr.success('You disliked the tweet')
        this.getAllTweets()
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
