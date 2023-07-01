import { Company } from './company';
import { NgModule } from '@angular/core';
import { AsideMenuComponent } from '../../app/aside-menu/aside-menu.component'
export class User {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    company: Company;
    //photo:string;

}
export class UserModule { }