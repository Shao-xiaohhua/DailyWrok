export enum Type {
    System,
    Custom,
}

export class Role {
  id: string;
  name: string;
  type: Type;
  description: string;
  constructor(id: string, name: string, type?: Type, description?: string) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.description = description;
  }
}
