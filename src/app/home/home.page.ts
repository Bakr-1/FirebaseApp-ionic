import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';

class Funlist{
  $key: string; 
  name: string;

  constructor(name){
    this.name = name;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  
  selectedCard: string;
  selectMode: boolean;
  Object: string;
  Locallist: Funlist[];       // Local list copy inside my app
  FirebaseList: AngularFireList<any>; // Online List on Firebase
  FirebaseObject: AngularFireObject<any>;

  constructor(private db:AngularFireDatabase) {
    this.selectedCard = "";
    this.selectMode = false;
    this.Object = "";
    this.Locallist = [];
    this.FirebaseList = this.db.list("/funlist");
    this.FirebaseList.snapshotChanges().subscribe(data => this.handleData(data));
  }
  handleData(data){
    console.table(data);
    this.Locallist = []; 
    data.forEach(item => {
      let pl = item.payload.toJSON();
      pl['$key'] = item.key;
      this.Locallist.push(pl as Funlist);
    });
  }
  createobject(){
    this.FirebaseList = this.db.list("/funlist");
    let myObject: Funlist = new Funlist(this.Object);
    this.FirebaseList.push(myObject);
    this.Object = "";
  }
  updateobject(){
    this.FirebaseObject = this.db.object("/funlist/" + this.selectedCard);
    this.FirebaseObject.update({
      name: this.Object
    });
    this.selectMode = false;
    this.Object = "";
  }
  deleteobject(key)
  {
    console.log(key);
    this.FirebaseObject = this.db.object("/funlist/" + key);
    this.FirebaseObject.remove();
  }
  selectobject(item)
  {
    this.selectedCard = item.$key;
    this.selectMode = true;
    this.Object = item.name;
  }
}
