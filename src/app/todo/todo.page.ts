import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  tasks:Array<Task>; //here we will hold all the list of tasks

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.readData('list')
    .then((response:any)=>{
      if(response){
        this.tasks = JSON.parse(response);
      }
    })
    .catch((error)=>{
      console.log(error);
    });
  }

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

    console.log("clicked on task: "+task.description);    
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
