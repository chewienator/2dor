import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StorageService}  from '../storage.service';
//models
import { Task } from '../models/task.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
})
export class CreateTaskPage implements OnInit {

  taskForm: FormGroup;
  todoTasks: Array<Task> = []; //array to store the task objects

  constructor(
    private router:Router,
    private formBuilder: FormBuilder,
    private storage:StorageService
  ) {
    console.log("Loading create task page");
    //binding form fields
    this.taskForm = formBuilder.group({
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      date: [new Date().toISOString(), [Validators.required]],
      time: [new Date().toISOString(), [Validators.required]]
    });
  }

  ngOnInit() {}

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

  addTask(task) {

    //create new task object
    let newTask = {
      id: new Date().getTime(),
      description: task.description,
      type: task.type,
      dueDate: new Date(task.date).getTime(),
      dueTime: new Date(task.time).getTime()
    };

    //push object to the list item array
    this.todoTasks.push(newTask);
    console.log("before sorting", this.todoTasks);
    //sort before saving
    this.sortList();
    console.log("after sorting", this.todoTasks);
    //save the changes to localstorage
    this.saveList();

  }

  //save data to localstorage
  saveList() {
    //save the data from our list to localstorage
    this.storage.saveData('todo-list', this.todoTasks)
      .then((response) => {
        //data written successfully
        this.router.navigate(['/tabs/todo']);
        console.log('Data saved successfully! :)');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //sorting the list
  sortList() {
    this.todoTasks.sort((item1, item2) => {
      return item2.dueTime - item1.dueTime;
    });
  }

}
