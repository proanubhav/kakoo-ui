import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from './models';
import { FileDropModule } from 'ngx-file-drop';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})

export class ChatbotComponent implements OnInit {
  showChatBox: boolean = false;
  public message: Message;
  public messages: Message[];
  constructor() {
    this.message = new Message('', 'assets/home/images/user.png', true);
    this.messages = [
      //new Message('WELCOME TO KAKOO', 'assets/home/images/user.png', new Date())
      new Message('We are the first happy customer of ourselves and we are hiring through our product indeed :)', 'assets/home/images/newlogokako.png', false),
      new Message('We love talented and smart people. If you want to join our mission, please drop your resume in the right zone.', 'assets/home/images/newlogokako.png', false)
    ];
  }
  ngOnInit() {
  }

  public files: UploadFile[] = [];

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
 
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        //console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    //console.log(event);
  }

  public fileLeave(event) {
    //console.log(event);
  }
}
