const { admin , general } = require("../parametros");

let inputs = [81,84];
let inputs2=[229 , 300];

let nuevo_numero = 81;
df = nuevo_numero - 81 ;

inputs = inputs.map( num => num+df);
inputs2 = inputs2.map(num=>num+df);

module.exports = {
  "Restricción de Pagina no segura" : function (browser) {
    browser 
      .url(general.urlTest)
      .waitForElementVisible('body')
      .maximizeWindow()
      .pause(3000)
       /* 
      .useXpath()
      .click("(//*[contains(text(),'Configuración avanzada')])[1]")
      .useXpath()
      .click("(//*[contains(text(),'Continuar a olimpiadas.test.gtic.gob.bo (no seguro)')])[1]")
      .pause(2000)
      */
     
    },
    "Login como administrador : Olimpiadas Estudiantiles" : function(browser){
      browser
      .useXpath()
      .waitForElementVisible("(//*[contains(text(),'Administración de olimpiadas')])[1]")
      .useXpath()
      .click("(//*[contains(text(),'Ingresar')])[1]")
      .pause(1000)
      .useCss()
      .setValue('#input-'+inputs[0],admin.user) 

      .pause(1000)
      .assert.visible('input[type=password]')
      .useCss()
      .setValue('#input-'+inputs[1], admin.password) 
      .saveScreenshot('tests_output/LoginOlimpiadas.png')
      .pause(1000)
      .useXpath()
      .click("(//*[contains(text(),'Ingresar')])[2]")
      .pause(2000)
    },
    "Modulo de Parametricas" : function (browser) {
      browser
        .useCss()
        .pause(4000)
        .useXpath()
        .click("(//*[contains(text(),'Parametros')])[1]")
        .pause(3000)
        .saveScreenshot('tests_output/Create Parametros.png')
    },


    "Crear de Areas" : function (browser){
      browser
      .useCss()
      //.waitForElementVisible("(//*[contains(text(),'Adicionar Usuario')])[1]")
      .pause(1000)
      .useXpath()
      .click("(//*[contains(text(),'add')])[1]")
      .pause(1000)
      .useCss()
      .setValue('#input-'+inputs2[0], 'Biologia') 
      .pause(1000)
      .useXpath()
      .click("(//*[contains(text(),' Enviar ')])[1]")
      .useXpath()
      .waitForElementVisible("(//*[contains(text(),'El registro fue agregado correctamente')])[1]")
      .pause(2000)

    },
    
    "Editar Area" : function (browser){
      browser
      .useXpath()
      .click("(//*[contains(text(),'edit')])[1]")
      .pause(1000)
      .useCss()
      .setValue('#input-'+inputs2[1], 'BioInformatica') 
      .useXpath()
      .click("(//*[contains(text(),' Enviar ')])[1]")
      .useXpath()
      .waitForElementVisible("(//*[contains(text(),'Se actualizó el registro correctamente')])[1]")

      .pause(2000)
    },
    "Desactivar Area" : function (browser){
      browser
      .useXpath()
      .click("(//*[contains(text(),'toggle_on')])[1]")
      .pause(1000)
      .useXpath()
      .click("(//*[contains(text(),'Aceptar')])[1]")
      .useXpath()
      .waitForElementVisible("(//*[contains(text(),'Registro actualizado con exito!')])[1]")
      .pause(2000)
    },
    "Eliminar Area" : function (browser){
      browser
      .useXpath()
      .click("(//*[contains(text(),'delete')])[1]")
      .pause(1000)
      .useXpath()
      .click("(//*[contains(text(),'Aceptar')])[1]")
      .useCss()
      .useXpath()
      .waitForElementVisible("(//*[contains(text(),'Registro eliminado satisfactoriamente')])[1]")
      .pause(5000)
      .end()
    }

}

