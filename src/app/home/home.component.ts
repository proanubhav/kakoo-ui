import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private jwtToken = null;
  showChatBox: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // scoll to top
    window.scroll(0, 0);
    this.loadToken();
    if (this.jwtToken) {
      this.router.navigate(['/user/profile'])
    }


  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  redirectRegistration() {
    this.router.navigate(['/user/signup']);
  }
  redirectLogin() {
    this.router.navigate(['/user/login']);
  }


}
