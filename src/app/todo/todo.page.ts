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

  todoTasks: Array<Task>; //here we will hold all the list of tasks
  doneTasks: Array<Task> = []; //here we will hold all the done tasks

  constructor(
    private router: Router,
    private storage: StorageService
  ) { console.log("Loading todo list page"); }

  ngOnInit() { }

  ionViewDidEnter() {
    this.storage.readData('todo-list')
      .then((response: any) => {
        if (response) {
          this.todoTasks = JSON.parse(response);
          console.log("loaded tasks", this.todoTasks);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.storage.readData('done-list')
      .then((response: any) => {
        if (response) {
          this.doneTasks = JSON.parse(response);
          console.log("loaded done tasks", this.doneTasks);
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }

  //go to create task page
  addTask() {
    this.router.navigate(['/create-task']);
  }

  //Go to task page
  editTask(id) {
    /*
      we need to send extra params fo the edit page knows what 
      task are we talking about
    */
    let navigationExtras: NavigationExtras = {
      state: {
        id: id
      }
    };
    this.router.navigate(['/edit-task'], navigationExtras);
  }

  deleteTask(id) {
    //search within the current task array
    this.todoTasks.forEach((theTask, index) => {
      //if id is found, set the object
      if (theTask.id == id) {
        this.deleteItem(index);
      }
    });
    
  }

  //delete item from the list
  deleteItem(index: number) {
    this.todoTasks.splice(index, 1);
    //save the changes to localstorage
    this.saveList();
  }

  //save data to localstorage
  saveList() {
    //save the data from our list to localstorage
    this.storage.saveData('todo-list', this.todoTasks)
      .then((response) => {
        //data written successfully
        console.log('Data saved successfully!');
        this.router.navigate(['/tabs/todo'], {
          queryParams: {refresh: new Date().getTime()}
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }

  //save data to localstorage on the done list
  changeStatus(task) {

    //add task to the done array
    this.doneTasks.push(task);
    //save the data from our list to localstorage
    this.storage.saveData('done-list', this.doneTasks)
      .then((response) => {
        //data written successfully
        console.log('Data saved successfully!');
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
