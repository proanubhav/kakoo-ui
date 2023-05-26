export class Skill {
    
  id: number;
  name: string;
  type: string;
  nExperience:number;
  description: string;
  evaluation: number;
  show:boolean;
  removeOption:boolean;

  constructor(type: string,name: string, description: string, evaluation: number,nExperience:number){
    this.type = type;
    this.name = name;
    this.description = description;
    this.evaluation = evaluation;
    this.nExperience=nExperience;
  }


}
