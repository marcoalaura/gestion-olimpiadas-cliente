const { admin , general } = require("../parametros");

let inputs = [80,83];

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
      .pause(200)
     
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

      .pause(2000)
      .assert.visible('input[type=password]')
      .useCss()
      .setValue('#input-'+inputs[1], admin.password) 
      .saveScreenshot('tests_output/LoginOlimpiadas.png')
      .pause(2000)
      .useXpath()
      .click("(//*[contains(text(),'Ingresar')])[2]")
      .pause(10000)
    }
 
}

   