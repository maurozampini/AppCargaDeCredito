import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, Platform } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../../pages/login/login';
import { ToastController } from 'ionic-angular';
import { HistorialPage } from '../historial/historial';

@IonicPage()
@Component({
  selector: 'page-menu-credito',
  templateUrl: 'menu-credito.html',
})
export class MenuCreditoPage
{
  platform: any;
  selectedItem: any;
  scanData: {};
  options: BarcodeScannerOptions;
  list: AngularFireList<any>;
  usuarioIngresado: string;
  credito100: string
  credito50: string;
  credito10: string;
  codigo: string;
  ExiteUsuario: boolean;
  MiUsuario: any;
  Micredito: number;
  CreditoMensaje: string;
  CreditoACargar: string;
  fecha = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private afdb: AngularFireDatabase,
              private barcodeScanner: BarcodeScanner,
              private authAf: AngularFireAuth,
              private toastCtrl: ToastController,
              @Inject(Platform) platform) 
  {
    //this.platform = this.platform.registerBackButtonAction(() => { this.confirmarCerrarSesion() });    
    //console.log(this.platform);
    this.ExiteUsuario = false;
    this.usuarioIngresado = this.navParams.get("usuario");
    this.list = this.afdb.list('/Credito');
    
    this.list.snapshotChanges().subscribe(
    snapshots => {
        snapshots.forEach(snapshot => {
              if(snapshot.payload.val().usuario == this.usuarioIngresado)
                 {
                    this.MiUsuario = snapshot.payload.ref;
                    this.ExiteUsuario = true;                                    
                    this.credito10 = snapshot.payload.val().credito10;
                    this.credito50 = snapshot.payload.val().credito50;
                    this.credito100 = snapshot.payload.val().credito100;
                    this.fecha[0] = snapshot.payload.child("fecha").val().inicio;
                    this.fecha[1] = snapshot.payload.child("fecha").val().fecha10;
                    this.fecha[2] = snapshot.payload.child("fecha").val().fecha50;
                    this.fecha[3] = snapshot.payload.child("fecha").val().fecha100;
                 }
          
        });

        if(this.ExiteUsuario == false)
        {
          this.list.push({
          usuario:this.usuarioIngresado,
          credito10:"",
          credito50:"",
          credito100:"",
          fecha: {   
            inicio: new Date().toLocaleString(),
            fecha10: "",
            fecha50: "",
            fecha100: ""
          }
        });
          this.credito10 = "";
          this.credito50 = "";
          this.credito100 = "";
          this.fecha[0] = new Date().toLocaleString()
        }
        this.GetCredito();

    });
  }

  historial(){
    this.navCtrl.push(HistorialPage, { usuario: this.usuarioIngresado })
}

confirmarCerrarSesion() {
    let alert = this.alertCtrl.create({
      title: 'Cerrar sesión',
      message: '¿Desea cerrar la sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar clickeado');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            console.log('Confirmar clickeado');
            this.authAf.auth.signOut();
            this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    alert.present();
  }

  scan()
  {
    this.options = {
        prompt : "Scanee el código"
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

        console.log(barcodeData);
        this.scanData = barcodeData;
        this.codigo = barcodeData.text;
        //this.getCreditoACargar();
        this.Cargar();
    }, (err) => {
        console.log("Error occured : " + err);
    });  
  } 

  
  Cargar()
  {   
        if ("8c95def646b6127282ed50454b73240300dccabc" == this.codigo) {
 
          if(this.credito10 == "")
          {
              this.MiUsuario.update({
                credito10:"8c95def646b6127282ed50454b73240300dccabc",
                credito50:this.credito50,
                credito100:this.credito100,
                fecha: {
                  inicio: this.fecha[0],
                  fecha10: new Date().toLocaleString(),
                  fecha50: this.fecha[2],
                  fecha100: this.fecha[3]
                }
            });

            this.credito10 = "8c95def646b6127282ed50454b73240300dccabc";

             let toast = this.toastCtrl.create({
              message: 'Se cargo 10 crédito',
              duration: 2000,
              position: 'top',
              cssClass: "ToastSuccess",
              showCloseButton: true,
              closeButtonText: "Cerrar",
              dismissOnPageChange: true
            });
            toast.present();

             this.CreditoACargar="Crédito a cargar 0";
             this.codigo = "";
          }
          else
          {
             let toast = this.toastCtrl.create({
              message: 'Ya se uso el codigo',
              duration: 2000,
              position: 'bottom',
              cssClass: "ToastWarning",
              showCloseButton: true,
              closeButtonText: "Cerrar",
              dismissOnPageChange: true
            });
            toast.present();
          }


      } else if ("ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 " == this.codigo) {

        if(this.credito50 == "")
        {
            this.MiUsuario.update({
              credito10:this.credito10,
              credito50:"ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ",
              credito100:this.credito100,
              fecha: {
                inicio: this.fecha[0],
                fecha10: this.fecha[1],
                fecha50: new Date().toLocaleString(),
                fecha100: this.fecha[3]
              }
          });

          this.credito50 = "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ";

          let toast = this.toastCtrl.create({
            message: 'Se cargo 50 crédito',
            duration: 2000,
            position: 'top',
            cssClass: "ToastSuccess",
            showCloseButton: true,
            closeButtonText: "Cerrar",
            dismissOnPageChange: true
          });
          toast.present();
           this.CreditoACargar="Crédito a cargar 0";
           this.codigo = "";
        }
        else
        {
          let toast = this.toastCtrl.create({
            message: 'Ya se uso el código',
            duration: 2000,
            position: 'bottom',
            cssClass: "ToastWarning",
            showCloseButton: true,
            closeButtonText: "Cerrar",
            dismissOnPageChange: true
          });
          toast.present();
        }

        
      } else if("2786f4877b9091dcad7f35751bfcf5d5ea712b2f" == this.codigo){
        
        if(this.credito100 == "")
        {
            this.MiUsuario.update({
              credito10:this.credito10,
              credito50:this.credito50,
              credito100:"2786f4877b9091dcad7f35751bfcf5d5ea712b2f",
              fecha: {
                inicio: this.fecha[0],
                fecha10: this.fecha[1],
                fecha50: this.fecha[2],
                fecha100: new Date().toLocaleString()
              }
          });

          this.credito100 = "2786f4877b9091dcad7f35751bfcf5d5ea712b2f";

          let toast = this.toastCtrl.create({
            message: 'Se cargo 100 credito',
            duration: 2000,
            position: 'top',
            cssClass: "ToastSuccess",
            showCloseButton: true,
            closeButtonText: "Cerrar",
            dismissOnPageChange: true
          });
          toast.present();

           this.CreditoACargar="Credito a cargar 0";
           this.codigo="";
        }
        else
        {
          let toast = this.toastCtrl.create({
            message: 'Ya se uso el codigo',
            duration: 2000,
            position: 'bottom',
            cssClass: "ToastWarning",
            showCloseButton: true,
            closeButtonText: "Cerrar",
            dismissOnPageChange: true
          });
          toast.present();
        }

      }
      else{
        //this.platform.registerBackButtonAction(() => { });
        let toast = this.toastCtrl.create({
          message: 'El código no es válido',
          duration: 2000,
          position: 'middle',
          cssClass: "ToastWarning",
          showCloseButton: true,
          closeButtonText: "Cerrar",
          dismissOnPageChange: true
        });
        toast.present();
      }
  }


  GetCredito()
  {
      this.Micredito = 0;

      if(this.credito10 != "")
      {
        this.Micredito += 10;
      }

      if(this.credito50 != "")
      {
        this.Micredito += 50;
      }

      if(this.credito100 != "")
      {
        this.Micredito += 100;
      }
      this.CreditoMensaje = "Tu crédito es: " + this.Micredito;
  }

  getCreditoACargar()
  {
    if ("8c95def646b6127282ed50454b73240300dccabc" == this.codigo)
    {
      this.CreditoACargar="Crédito a cargar 10";
    }

    else if ("ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 " == this.codigo)
    {
      this.CreditoACargar="Crédito a cargar 50";
    }

    else if("2786f4877b9091dcad7f35751bfcf5d5ea712b2f" == this.codigo)
    {
      this.CreditoACargar="Crédito a cargar 100";
    }

    else
    {
      let toast = this.toastCtrl.create({
        message: 'Código inválido',
        duration: 2000,
        position: 'middle',
        cssClass: "ToastWarning",
        showCloseButton: true,
        closeButtonText: "Cerrar",
        dismissOnPageChange: true
      });
      toast.present();
    }
  }
}
