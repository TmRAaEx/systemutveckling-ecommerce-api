export interface ITodo {
  _id?: string;
  id?: string;
  task: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
//todo interface that works with mongodb and mysql. If you are using mongoDB you can remove the id field and if you are using mysql you can remove  _id
