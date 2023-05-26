import { Component, OnInit, Input, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Message } from '../../models';
import { MessageItemComponent } from '../../components/message-item/message-item.component';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ChatbotService } from "../../chatbot.service"
import { HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit, AfterViewInit {

  @Input('messages')
  public messages: Message[];

  @ViewChild('chatlist', { read: ElementRef }) chatList: ElementRef;
  @ViewChildren(MessageItemComponent, { read: ElementRef }) chatItems: QueryList<MessageItemComponent>;

  constructor(private chatbotService: ChatbotService, private http: HttpClient, ) { }

  ngAfterViewInit() {
    this.chatItems.changes.subscribe(elements => {
      // //console.log('messsage list changed: ' + this.messages.length);
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    try {
      this.chatList.nativeElement.scrollTop = this.chatList.nativeElement.scrollHeight;
    }
    catch (err) {
      //console.log('Could not find the "chatList" element.');
    }
  }
  showDragDrop: boolean;
  ngOnInit() {
    this.showDragDrop = true;
  }

  ////
  public files: UploadFile[] = [];

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.chatbotService.pushFileToStorage(file)
            .subscribe(res => {
              //console.log("Je suis ici");
            });

          //console.log(droppedFile.relativePath, file);

        });

      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        //console.log(droppedFile.relativePath, fileEntry);
      }
      let message = new Message(droppedFile.fileEntry.name, 'assets/home/images/user.png', true);
      this.messages.push(message);
      message = new Message('Thank you for your application! We will get back to you as soon as possible.', 'assets/home/images/user.png', false);
      this.messages.push(message);
      this.showDragDrop = false;

    }
  }

  public fileOver(event) {
    //console.log(event);
  }

  public fileLeave(event) {
    //console.log(event);
  }
  errorMessageMxSize: string = undefined;
  errorMessageMaxCv: string = undefined;
  errorMessageTypeFormatt: string = undefined;
  selectedFiles: FileList;
  selectFile(event) {
    this.errorMessageMaxCv = undefined;
    this.errorMessageMxSize = undefined;
    this.errorMessageTypeFormatt = undefined;
    this.selectedFiles = event.target.files;
    let message = new Message(this.selectedFiles.item(0).name, 'assets/home/images/user.png', true);
    this.messages.push(message);
    this.showDragDrop = false;
    message = new Message('Thank you for your application! We will get back to you as soon as possible.', 'assets/home/images/newlogokako.png', false);
    this.messages.push(message);


    this.chatbotService.pushFileToStorage(this.selectedFiles.item(0))
      .subscribe(res => {
        //console.log("Je suis ici");

      });


  }
  /*
  
    percentDone: number;
    uploadSuccess: boolean;
    upload(files: File[]) {
      //pick from one of the 4 styles of file uploads below
      this.uploadAndProgress(files);
    }
    uploadAndProgress(files: File[]) {
      //console.log(files)
      var formData = new FormData();
      Array.from(files).forEach(f => formData.append('file', f))
  
      this.http.post('https://file.io', formData, { reportProgress: true, observe: 'events' })
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.percentDone = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.uploadSuccess = true;
          }
        });
      Array.from(files).forEach(f =>
        this.chatbotService.pushFileToStorage(f)
          .subscribe(res => {
            //console.log("Je suis ici");
            let message = new Message('Thank you for your application! We will get back to you as soon as possible.', 'assets/home/images/user.png', true);
            this.messages.push(message);
  
          })
      );
  
  
    }
  
    //this will fail since file.io dosen't accept this type of upload
    //but it is still possible to upload a file with this style
    uploadAndProgressSingle(file: File) {
      this.http.post('https://file.io', file, { reportProgress: true, observe: 'events' })
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.percentDone = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.uploadSuccess = true;
          }
        });
    }*/
}