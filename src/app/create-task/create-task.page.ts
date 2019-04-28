import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
})
export class CreateTaskPage implements OnInit {

  taskForm: FormGroup;

  constructor(
    private formBuilder:FormBuilder,
  ) { 
    //binding form fields
    this.taskForm = formBuilder.group({
      description: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    
  }

  addTask(task){
    console.log(task);
  }

}
