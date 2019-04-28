import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service'; //import data service
import { Router, NavigationExtras } from '@angular/router';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  todoTasks:Array<Task>; //here we will hold all the list of tasks

  constructor(
    private router:Router,
    private storage:StorageService
  ) { console.log("Loading todo list page");}

  ngOnInit() { }

  ionViewDidEnter(){
    this.storage.readData('todo-list')
    .then((response:any)=>{
      if(response){
        this.todoTasks = JSON.parse(response);
        console.log("loaded tasks", this.todoTasks);
      }
    })
    .catch((error)=>{
      console.log(error);
    });
  }

  //go to create task page
  addTask(){
    this.router.navigate(['/create-task']);
  }

  //Go to task page
  editTask(task){
    /*
      we need to send extra params fo the edit page knows what 
      task are we talking about
    */
    let navigationExtras: NavigationExtras = {
      state: {
        id: task.id
      }
    };
    this.router.navigate(['/edit-task'], navigationExtras);   
  }

  //read data from localstorage
  readData( key ){
    return new Promise((resolve,reject)=>{
      try{
        let data = window.localStorage.getItem( key );
        if( data ){
          resolve(data);
        }else{
          throw('no data');
        }
      }
      catch(exception){
        reject(exception);
      }
    })
  }

}
