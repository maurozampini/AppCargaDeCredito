import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController, LoadingController} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  username:string;
  password:string;
  Mensaje:string;
  passwordconfirm:string;
  

  constructor(public spiner: LoadingController,
              public navCtrl: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              private _auth: AngularFireAuth)
              {

              }

  ionViewDidLoad()
  {
    console.log('ionViewDidLoad RegisterPage');
  }

  async Aceptar()
  {
    if(this.password.length > 5)
    {
      if(this.password == this.passwordconfirm)
      {  
          let espera = this.MiSpiner();
          espera.present();    
          await this._auth.auth.createUserWithEmailAndPassword(this.username, this.password)
          .then(result => 
            {
              espera.dismiss();
              this.Mensaje = this.username + "¡Fue registrado exitosamente!";
              alert(this.Mensaje);
              this.navCtrl.pop();
            })
          .catch(error =>
             {
               espera.dismiss();
               console.log(error);
               setTimeout(() => {
               this.showAlert(error.message, "Error al registrarse");
               }, 500);
             })
      }

      else
      {
        this.showAlert("Las claves no coinciden, intente nuevamente", "Error al registrarse")
      }
    }

    else
    {
      this.showAlert("La clave debe contener por lo menos 6 caracteres", "Error al registrarse")
    }
  }
  
  showAlert(mensaje: string, titulo: string)
  {
    switch(mensaje)
    {
      case "The email address is badly formatted.":
      {
        mensaje = "El email no contiene un formato correcto";
        break;
      }
    }
    let alert = this.alertCtrl.create(
    {
      title: titulo,
      subTitle: mensaje,
      buttons: ['OK'],
      cssClass: 'alert'
    });
    alert.present();
  }  

  MiSpiner()
  {
    let loader = this.spiner.create(
      {
        content: "Espere...",
        duration: 2500
      });
      return loader;
  }

  async Cancelar()
  {
    this.navCtrl.pop();
  }
}
