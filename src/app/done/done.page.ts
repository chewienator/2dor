import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service'; //import data service
import { Router, NavigationExtras } from '@angular/router';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-done',
  templateUrl: './done.page.html',
  styleUrls: ['./done.page.scss'],
})
export class DonePage implements OnInit {

  doneTasks: Array<Task> = []; //here we will hold all the done tasks

  constructor(
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.storage.readData('done-list')
      .then((response: any) => {
        if (response) {
          this.doneTasks = JSON.parse(response);
          //console.log("loaded done tasks", this.doneTasks);
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }

  addTask(){
    this.router.navigate(['/create-task']);
  }

  deleteTask(id) {
    //search within the current task array
    this.doneTasks.forEach((theTask, index) => {
      //if id is found, set the object
      if (theTask.id == id) {
        this.deleteItem(index);
      }
    });
    
  }

  //delete item from the list
  deleteItem(index: number){
    this.doneTasks.splice(index, 1);
    //save the changes to localstorage
    this.saveList();
  }

  //save data to localstorage
  saveList() {
    //save the data from our list to localstorage
    this.storage.saveData('done-list', this.doneTasks)
      .then((response) => {
        //data written successfully
        console.log('Data saved successfully!');
        this.router.navigate(['/tabs/done'], {
          queryParams: {refresh: new Date().getTime()}
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }
}
