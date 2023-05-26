import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageItemComponent } from './components/message-item/message-item.component';
import { MessageFormComponent } from './components/message-form/message-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ChatbotService } from "./chatbot.service";
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { ChatbotComponent } from './chatbot.component';
import { FileDropModule } from 'ngx-file-drop';
//matautocomplete
export * from "./components/message-list/message-list.component";
export * from "./components/message-item/message-item.component";
export * from "./components/message-form/message-form.component";
export * from "./chatbot.component";

import { MatMenuModule, MatButtonModule, MatIconModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';





@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatRadioModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatProgressBarModule,
        NgbModule,
        HttpModule,
        HttpClientModule,
        FileDropModule,
    ],
    exports: [
    ],
    declarations: [
        //MessageListComponent,
        //MessageItemComponent,
        //MessageFormComponent,
        //ChatbotComponent,
    ],
    providers: [ChatbotService,
    ],
})
export class ChatbotModule {
}
