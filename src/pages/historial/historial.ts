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

  ExiteUsuario: boolean = false;
  list: AngularFireList<any>;
  usuarioIngresado: string;
  MiUsuario: any;
  fecha = [];
  mostrarFechaInicio: string;
  mostrarFecha10: string;
  mostrarFecha50: string;
  mostrarFecha100: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afdb: AngularFireDatabase)
     {
    this.usuarioIngresado = this.navParams.get("usuario");
    this.list = this.afdb.list('/Credito');

    this.list.snapshotChanges().subscribe(
      snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.payload.val().usuario == this.usuarioIngresado && this.ExiteUsuario == false) {
            this.MiUsuario = snapshot.payload.ref;
            this.ExiteUsuario = true;
            this.fecha[0] = snapshot.payload.child("fecha").val().inicio;
            this.fecha[1] = snapshot.payload.child("fecha").val().fecha10;
            this.fecha[2] = snapshot.payload.child("fecha").val().fecha50;
            this.fecha[3] = snapshot.payload.child("fecha").val().fecha100;
            if (this.fecha[0] != null && this.ExiteUsuario == true) {
              this.mostrarFechaInicio = "Primer inicio: " + this.fecha[0];
            }
            if (this.fecha[1] != null && this.ExiteUsuario == true) {
              this.mostrarFecha10 = "Carga 10: " + this.fecha[1];
            }
            if (this.fecha[2] != null && this.ExiteUsuario == true) {
              this.mostrarFecha50 = "Carga 50: " + this.fecha[2];
            }
            if (this.fecha[3] != null && this.ExiteUsuario == true) {
              this.mostrarFecha100 = "Carga 100: " + this.fecha[3];
            }
          }
        });
      })
  }

  ionViewDidLoad() {

  }

}
