const { admin , general } = require("../parametros");

let inputs = [80,83];

let inputs2=[220 , 223 ,226 , 229 , 233 ,238 , 239 ]
module.exports = {
  "Restrigccion de Pagina no segura" : function (browser) {
    browser 
      .url(general.urlTest)
      .waitForElementVisible('body')
      .maximizeWindow()
      .pause(3000)
      .useXpath()
      .click("(//*[contains(text(),'Configuración avanzada')])[1]")
      .useXpath()
      .click("(//*[contains(text(),'Continuar a olimpiadas.test.gtic.gob.bo (no seguro)')])[1]")
      .pause(2000)
     
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
    "Modulo de usuarios" : function (browser) {
      browser
        .useCss()
        .pause(4000)
        .useXpath()
        .click("(//*[contains(text(),'Usuarios')])[1]")
        .pause(3000)
        //.saveScreenshot('tests_output/Create user.png')
    },


    "Crud de usuarios" : function (browser){
      browser
      .useCss()
      //.waitForElementVisible("(//*[contains(text(),'Adicionar Usuario')])[1]")
      .pause(1000)
      .useXpath()
      .click("(//*[contains(text(),'add')])[1]")
      .pause(1000)
      .useCss()
      .setValue('#input-'+inputs2[0], 'PEREZ') 
      .useCss()
      .setValue('#input-'+inputs2[1], 'PEREZ') 
      .pause(1000)
      .useCss()
      .setValue('#input-'+inputs2[2], 'PEREZ') 
      .useXpath()

      .useCss()
      .setValue('#input-'+inputs2[3], '187187') 
      //seleccionar ROL
      .useCss()
      .setValue('#input-'+inputs2[4],'07/07/1997' ) 
      .pause(1000)
      .useCss()
      .setValue('#input-'+inputs2[5],'perez@agetic.gob.bo' ) 



      //selecionar ROl

      .pause(5000)
      .useXpath()
      .click("(//*[contains(text(),'Roles(*)')])[1]")
      .pause(1000)
      .useXpath()
      .click("(//*[contains(text(),'ESTUDIANTE')])[1]")


      .pause(2000)
      .end()
    }
}

   