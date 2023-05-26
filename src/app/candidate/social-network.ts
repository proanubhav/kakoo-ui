export class SocialNetwork {

  id: number;
  type: string;
  url: string;
  removeOption: boolean;

  constructor(type: string, url: string) {
    this.type = type;
    this.url = url;
  }

}