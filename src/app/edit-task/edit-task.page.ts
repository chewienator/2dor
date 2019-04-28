import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from '../storage.service';
import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
//models
import { Task } from '../models/task.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.page.html',
  styleUrls: ['./edit-task.page.scss'],
})
export class EditTaskPage implements OnInit {

  taskID: number = null;
  editTaskForm: FormGroup;
  todoTasks: Array<Task> = []; //array to query the task object
  selectedTask: Task = null;
  selectedIndex: number = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private notification:LocalNotifications,
    private alertCtrl:AlertController
  ) {
    console.log("Loading edit task page");
    //grab the task id from the route
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.taskID = this.router.getCurrentNavigation().extras.state.id;
      }
    });

    //load the localstorage to search the task needed
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

      
    //make observable for click event on notification
    this.notification.on('click').subscribe(res=>{
      console.log('clicked: ',res);
      //get message from result.data if found use mydata if not just empty string
      let msg = res.data ? res.data.mydata : '';
      //show alert
      this.showAlert(res.title, res.text, msg);
    });
    //make observable for trigger event on notification
    this.notification.on('trigger').subscribe(res=>{
      console.log('triggered: ',res);
      //get message from result.data if found use mydata if not just empty string
      let msg = res.data ? res.data.mydata : '';
      //show alert
      this.showAlert(res.title, res.text, msg);
    });
  }

  ngOnInit() {
    //if there is an ID load the task
    if (this.taskID != null) {
      this.loadTask();
    }

    //binding form fields
    this.editTaskForm = this.formBuilder.group({
      description: [this.selectedTask.description, [Validators.required]],
      type: [this.selectedTask.type, [Validators.required]],
      date: [new Date(this.selectedTask.dueDate).toISOString(), [Validators.required]],
      time: [new Date(this.selectedTask.dueTime).toISOString(), [Validators.required]]
    });
  }

  /*
  This function searches for an object with a specific id 
  within the Tasks array, and returns that object
  */
  loadTask() {
    //search within the current task array
    this.todoTasks.forEach((theTask, index) => {
      //if id is found, set the object
      if (theTask.id == this.taskID) {
        this.selectedTask = theTask;
        this.selectedIndex = index;
      }
    });
  }

  editTask(task) {
    //first delete the object from the array
    this.deleteItem(this.selectedIndex);

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
    
    //sort before saving
    this.sortList();

    this.notification.schedule({
      id:newTask.id,
      title: 'You have a task deadline!!',
      text:newTask.description,
      trigger:{at:new Date(newTask.dueTime)},
      foreground: true
    });

    //save the changes to localstorage
    this.saveList();

  }

  //sorting the list
  sortList() {
    this.todoTasks.sort((item1, item2) => {
      return item2.dueTime - item1.dueTime;
    });
  }

  //delete item from the list
  deleteItem(id: number) {
    this.todoTasks.splice(this.selectedIndex, 1);
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
        this.router.navigate(['/tabs/todo']);
        
      })
      .catch((error) => {
        console.log(error);
      });
  }

      //show alert helper function
      showAlert(header, sub, msg){
        this.alertCtrl.create({
          header: header,
          subHeader: sub,
          message: msg, 
          buttons: ['OK']
        }).then(alert=>alert.present());
      }

}
