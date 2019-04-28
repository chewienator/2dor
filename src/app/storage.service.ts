import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
/*
  saveData( key, value ){
    //make a new promise to save the data
    return new Promise((resolve,reject) => {
      //set the key value pair to save into localstorage
      window.localStorage.setItem( key, JSON.stringify(value) );
      //if the item exists then return true, if not reject
      if( window.localStorage.getItem(key) ){
        resolve(true);
      }else{
        reject(false);
      }
    });
  }
  */
}
