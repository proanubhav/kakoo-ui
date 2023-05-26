export class UserDemo {
    firstName: String;
    lastName: String;
    companyName: String;
    companyPhone: String;
    email: String;
    date: String;
    code: String;
    constructor(firstName: string, lastName: string, email: string, companyName: String,
        companyPhone: String, date: String, code: String
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.companyName = companyName;
        this.companyPhone = companyPhone;
        this.date = date;
        this.code = code;
    }
}