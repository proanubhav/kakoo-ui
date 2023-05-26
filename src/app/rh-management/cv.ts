export class Cv {
    id:number;
    uploadDate:Date;
    cv:string;
    location:string;
    uuid:number;
    constructor(uploadDate: Date,cv :string,location:string){
        this.uploadDate=uploadDate;
        this.cv=cv;
        this.location=location;
    
    }

}
