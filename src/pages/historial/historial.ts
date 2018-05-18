import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html',
})
export class HistorialPage {

  list: AngularFireList<any>;
  usuarioIngresado: string;
  MiUsuario: any;
  fecha = [];
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afdb: AngularFireDatabase,
    private authAf: AngularFireAuth) 
     {

    this.list = this.afdb.list('/Credito');

    this.list.snapshotChanges().subscribe(
    snapshots => {
        snapshots.forEach(snapshot => {
        console.log(snapshot.payload.val().usuario);
              if(snapshot.payload.val().usuario == this.usuarioIngresado)
                 {
                    this.MiUsuario = snapshot.payload.ref;
                    this.fecha[0] = snapshot.payload.child("fecha").val().inicio;
                    this.fecha[1] = snapshot.payload.child("fecha").val().fecha10;
                    this.fecha[2] = snapshot.payload.child("fecha").val().fecha50;
                    this.fecha[3] = snapshot.payload.child("fecha").val().fecha100;
                 }
          
        });

        if(this.fecha[0] != "")
        {
          
        }
        if(this.fecha[1] != "")
        {
          
        }
        if(this.fecha[2] != "")
        {
          
        }
        if(this.fecha[3] != "")
        {
          
        }

        }
      )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorialPage');
  }

}
