export interface IGroupByField {
  title: string;
  internalName: string;
  level: number;
}

export interface ISortByField {
  title: string;
  internalName: string;
  index: number;
}

export interface IViewField {
  title: string;
  internalName: string;
  fieldType: string;
  order: number;
}
