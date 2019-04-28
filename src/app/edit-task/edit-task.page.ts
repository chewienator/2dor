import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from '../storage.service';
//models
import { Task } from '../models/task.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.page.html',
  styleUrls: ['./edit-task.page.scss'],
})
export class EditTaskPage implements OnInit {

  taskID: number = null;
  //taskForm: FormGroup;
  todoTasks: Array<Task> = []; //array to query the task object
  selectedTask: Task = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private storage: StorageService
  ) {
    //grab the task id from the route
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.taskID = this.router.getCurrentNavigation().extras.state.id;
      }
    });
    console.log("taskID: ", this.taskID);
/*
    //binding form fields
    this.taskForm = formBuilder.group({
      id:[this.selectedTask.id, [Validators.required]],
      description: [this.selectedTask.description, [Validators.required]],
      type: [this.selectedTask.type, [Validators.required]],
      date: [new Date(this.selectedTask.dueDate).toISOString(), [Validators.required]],
      time: [new Date(this.selectedTask.dueTime).toISOString(), [Validators.required]]
    });
*/
  }

  ngOnInit() {
    this.readData('todo-list')
      .then((response: any) => {
        if (response) {
          this.todoTasks = JSON.parse(response);
          console.log("loaded tasks", this.todoTasks);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    console.log('taskID:' + this.taskID);
    //console.log(this.dataService.loadTask(this.taskID));
    //if there is an ID load the task
    if (this.taskID != null) {
      this.selectedTask = this.loadTask(this.taskID);
    }
    console.log('the task is', this.selectedTask);
  }

  /*
  This function searches for an object with a specific id 
  within the Tasks array, and returns that object
  */
  loadTask(id): Task {
    //search within the current task array
    this.todoTasks.forEach((theTask) => {
      //if id is found, set the object
      if (theTask.id == id) {
        this.selectedTask = theTask;
      }
    });
    return this.selectedTask;
  }

  //read data from localstorage
  readData(key) {
    return new Promise((resolve, reject) => {
      try {
        let data = window.localStorage.getItem(key);
        if (data) {
          resolve(data);
        } else {
          throw ('no data');
        }
      }
      catch (exception) {
        reject(exception);
      }
    })
  }

}
