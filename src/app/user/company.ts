export class Company {

    id:number;
    address:string;
    name:string;
    phone:string;
    type:string;

    constructor(address: string,name:string,phone:string,type:string)
    {   this.address=address,
        this.name=name,
        this.phone=phone,
        this.type=type
    }

}
