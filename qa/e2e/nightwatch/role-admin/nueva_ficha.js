const { supervisor } = require("../parametros");
const {general,establecimiento , paciente , antecedentes,
  clinico,hospitalizacion , enfermedades , contacto ,
  laboratorio,notificador,kit} = require("../datos_json/paciente");

  const df = 319-374;
  // Paso 1 y 2
  let inputs = [374,381,388,399,503,510,517,527,530,533,542,549,556,539,564,571,578,581,584 ];
  // Paso 3 , 4 y 5
  let inputs2=[735,742,760,767,774,781,959,966,997,1045,1022,1026,]
  // Paso 6 , 7, 8,9,10
  let inputs3 =[1167,1170,1173,1179,1182,1475,1482,1421,1429,1436,1664,1667,1684]

  inputs = inputs.map( num => num+df);
  inputs2 = inputs2.map(num=>num+df);
  inputs3 = inputs3.map(num=>num+df);
  console.log(inputs);
  console.log(inputs2);
  console.log(inputs3);

module.exports = {
  "Login a la pagina de fichas como usuario Tecnico" : function (browser) {
    browser
      .url(general.urlTest)
      .maximizeWindow()
      .waitForElementVisible('body')
      .assert.titleContains(
        '.:: Sistema Integrado de Vigilancia Epidemiológica ::.'
      )
      .assert.visible('input[type=text]')
      .setValue('input[type=text]',supervisor.user)
      .assert.visible('input[type=password]')
      .setValue('input[type=password]',supervisor.password)
      .saveScreenshot('tests_output/fichasLogin.png')
      .assert.visible('button[type=submit]')
      .click('button[type=submit]')
      .pause(3000)
      .useXpath().click("//*[contains(text(),'ACTUALIZAR')]")
      .pause(2000)
    },
    "Inicio llenado nueva ficha medica" : function (browser) {
      browser
        .useXpath()
        .pause(2000)
        .useCss()
        .url("https://test.agetic.gob.bo/fichas-medicas/#/listado")
        .pause(2000)
        //.saveScreenshot('tests_output/fichasNuevo.png')
    },


    "Llenado paso 1 -Ficha Epidemiologica" : function (browser){
      browser
      .useCss()
      .click(
        'i[class="v-icon notranslate mr-2 material-icons theme--dark"]'
      )
      .pause(5000)
      .useXpath()
      .waitForElementVisible("(//*[contains(text(),'Por favor llene los siguiente campos del formulario')])[1]")
      //selecciona departamento
      .useCss()
      .click('#input-'+inputs[0]) // inicio del input diferencia 4
      .useXpath()
      .click("(//*[contains(text(),'"+establecimiento.departamento+"')])[1]")
      //seleciona municipio

      .useCss()
      .click('#input-'+inputs[1])  // +7
      .useXpath()
      .click("(//*[contains(text(),'"+establecimiento.municipio+"')])[1]")

      //selecciona establecimiento
      .useXpath()
      .useCss()
      .click('#input-'+inputs[2]) // +7
      .useXpath()
      .click("(//*[contains(text(),'"+establecimiento.establecimiento+"')])[1]")

      .useCss()
      .setValue('#input-'+inputs[3], establecimiento.fecha_notificacion) //+11

      .useXpath().click("//*[contains(text(),'Caso identificado por búsqueda activa')]")

      .pause(2000)
      .useCss()
      .click(
        'i[style="font-size: 35px;"]'
      )
      .pause(2000)
    },

    "Llenado paso 2 : Ficha Epidemiologica" : function (browser) {
      browser
      //selecciona tipo de documento
      .useXpath()
      .useCss()
      .click('#input-'+inputs[4])  // inicio 507
      .useXpath()
      .click("(//*[contains(text(),'"+paciente.tipo_documento+"')])[1]")
      .useCss()
      .setValue('#input-'+inputs[5], paciente.numero)  // +7
      .setValue('#input-'+inputs[6],paciente.fecha_nacimiento)  //+7
      .setValue('#input-'+inputs[7],paciente.nombre)   //+10
      .setValue('#input-'+inputs[8],paciente.paterno)  //+3
      .setValue('#input-'+inputs[9],paciente.materno)  //+3
      //seleccionando genero
      .useXpath()
      .useCss()
      .click('#input-'+inputs[10])  //+9
      .useXpath()
      .click("(//*[contains(text(),'"+paciente.genero+"')])[1]")
      //seleccionando etnia
      .useXpath()
      .useCss()
      .click('#input-'+inputs[11])  //+7
      .useXpath()
      .click("(//*[contains(text(),'"+paciente.etnica+"')])[1]")
      //pais procedencia
      .useXpath()
      .useCss()
      .click('#input-'+inputs[12])  //+7
      .useXpath()
      .click("(//*[contains(text(),'"+paciente.procedencia+"')])[1]")
      .useCss()
      .setValue('#input-'+inputs[13],paciente.telefono)  // -17
      // PASO 2 SECCION 2
      //Residencia
      .useXpath()
      .useCss()
      .click('#input-'+inputs[14])          // continuando +8
      .useXpath()
      .click("(//*[contains(text(),'"+paciente.departamento+"')])[1]")
      //municipio
      .useXpath()
      .useCss()
      .click('#input-'+inputs[15])  //+7
      .useXpath()
      .click("(//*[contains(text(),'"+paciente.municipio+"')])[1]")

      .useCss()
      .setValue('#input-'+inputs[16],paciente.calle) //+7

      .useCss()
      .setValue('#input-'+inputs[17],paciente.zona) //+3
 
      .useCss()
      .setValue('#input-'+inputs[18],paciente.nrm_domicilio)  //+3
      .useCss()
      .click(
        'i[style="font-size: 35px;"]'
      )
      .pause(2000)
    },

    "Llenado Paso 3 - Fichas Epidemiologica" : function(browser){
      browser
      //Ocupacion
      .useXpath()
      .useCss()
      .click('#input-'+inputs2[0]) // 739
      .useXpath()
      .click("(//*[contains(text(),'"+antecedentes.ocupacion+"')])[1]")
      //Detalle ocupacion
      .useXpath()
      .useCss()
      .click('#input-'+inputs2[1])
      .useXpath()
      .click("(//*[contains(text(),'"+antecedentes.otra+"')])[1]")
      // pais
      .useXpath()
      .useCss()
      .click('#input-'+inputs2[2])
      .useXpath()
      .click("(//*[contains(text(),'"+antecedentes.pais+"')])[1]")
      // Departamento
      .useXpath()
      .useCss()
      .click('#input-'+inputs2[3])
      .useXpath()
      .click("(//*[contains(text(),'"+antecedentes.departamento+"')])[1]")
      // pais
      .useXpath()
      .useCss()
      .click('#input-'+inputs2[4])
      .useXpath()
      .click("(//*[contains(text(),'"+antecedentes.municipio+"')])[1]")
      //ciudadEstable/Leve
      .useCss()
      .setValue('#input-'+inputs2[5],antecedentes.ciudad)

      .pause(1000)
      .useCss()
      .click(
        'i[style="font-size: 35px;"]'
      )
      .pause(3000)
    },

    "Llenado paso 4 - Ficha Epidemiologica": function(browser){
      browser
      .useCss()
      .useXpath().click("//*[contains(text(),'"+clinico.sintoma1 +"')]")
      .useXpath().click("//*[contains(text(),'"+clinico.sintoma2 +"')]")
      // Estado
      .useXpath()
      .useCss()
      .click('#input-'+inputs2[6])
      .useXpath()
      .click("(//*[contains(text(),'"+clinico.estado+"')])[1]")
      // Dato clinico
      .useXpath()
      .useCss()
      .click('#input-'+inputs2[7])
      .useXpath()
      .click("(//*[contains(text(),'"+clinico.clinico+"')])[1]")
      .useCss()
      .click(
        'i[style="font-size: 35px;"]'
      )
    },

    "Llenado paso 5- Ficha Epidemiologica" : function(browser){
      browser
      .pause(1000)
      .useCss()
      .setValue('#input-'+inputs2[8],hospitalizacion.fecha_inicio)
      // Ambulatorio o internado
      .useXpath()
      .useCss()
      .click('#input-'+inputs2[9])
      .useXpath()
      .click("(//*[contains(text(),'"+hospitalizacion.ambulatorio+"')])[1]")
      //lugar
      .useCss()
      .setValue('#input-'+inputs2[10],hospitalizacion.lugar)
      //fecha aislamiento
      .setValue('#input-'+inputs2[11],hospitalizacion.fecha_aislamiento)
      .useXpath().click("//*[contains(text(),'Ventilación Mecánica')]")
      //Saltar paso
      .useCss()
      .click(
        'i[style="font-size: 35px;"]'
        )
      },
      "Llendado paso 6 - Ficha Epidemiologica": function(browser){
        browser
        .pause(2000)
        .useCss()
        .useXpath().click("//*[contains(text(),'"+enfermedades.activar+"')]")
        .useXpath().click("//*[contains(text(),'"+enfermedades.enfermedad1+"')]")
        .useXpath().click("//*[contains(text(),'"+enfermedades.enfermedad2+"')]")
        .useXpath().click("//*[contains(text(),'"+enfermedades.enfermedad3+"')]")
        //Saltar paso
        .pause(1000)
        .useCss()
        .click(
          'i[style="font-size: 35px;"]'
          )
        },
      "Llenado paso 7 - Ficha Epidemiologica":function(browser){
        browser
        .pause(2000)
        .useCss()
        .useXpath().click("//*[contains(text(),'"+contacto.activar+"')]")
        .pause(2000)
        //llenado de datos de contacto
        .useCss()
        .setValue('#input-'+inputs3[0],contacto.nombre)
        .setValue('#input-'+inputs3[1],contacto.paterno)
        .setValue('#input-'+inputs3[2],contacto.materno)
        .setValue('#input-'+inputs3[3],contacto.edad)
        .setValue('#input-'+inputs3[4],contacto.telefono)
        .assert.visible('button[type=submit]')
        .pause(1000)
        .click('button[type=submit]')
        .pause(2000)
        //Saltar paso
        .useCss()
        .click(
          'i[style="font-size: 35px;"]'
          )
        .pause(3000)
      },
      "Llenado paso 8 - Ficha Epidemiologica":function(browser){
        browser
        .pause(1000)
        .useCss()
        .useXpath().click("//*[contains(text(),'"+laboratorio.activar+"')]")
        .pause(3000)
        //llenado de datos de contacto
        // Tipo de muestra
        .useXpath()
        .useCss()
        .click('#input-'+inputs3[5])
        .useXpath()
        .click("(//*[contains(text(),'"+laboratorio.tipo+"')])[1]")
        // Nombre Laboratorio
        .useXpath()
        .useCss()
        .click('#input-'+inputs3[6])
        .useXpath()
        .click("(//*[contains(text(),'"+laboratorio.nombre+"')])[1]")
        .useCss()
        .setValue('#input-'+inputs3[7],laboratorio.fecha_muestra)
        .setValue('#input-'+inputs3[8],laboratorio.fecha_envio)
        .setValue('#input-'+inputs3[9],laboratorio.observaciones)
        .assert.visible('button[type=submit]')
        .pause(1000)
        .click('button[type=submit]')
        .pause(3000)
        //Saltar paso
        .useCss()
        .click(
          'i[style="font-size: 35px;"]'
          )
        },
        "Llenado paso 9 - Ficha Epidemiologica" : function (browser){
          browser
          .pause(1000)
          .useCss()
          //.setValue('#input-'+inputs3[10],notificador.nombre)
          //.setValue('#input-'+inputs3[11],notificador.telefono)
          //.waitForElementVisible("(//*[contains(text(),'Mabel ')])[1]")
          .click(
            'i[style="font-size: 35px;"]'
          )
          .pause(2000)

      },
      "Llenado paso 10 - Ficha Epidemiologica": function(browser){
        browser
        // kit medicamento
        .pause(1000)
        .useXpath()
        .click("(//*[contains(text(),'"+kit.activar+"')])[1]")

        .useXpath()
        .useCss()
        .click('#input-'+inputs3[12])
        .useXpath()
        .click("(//*[contains(text(),'"+kit.kit_medicamento+"')])[1]")
        .useCss()
        .click(
          'i[style="font-size: 35px;"]'
        )
        .useXpath()
        .click("(//*[contains(text(),'SIGUE PENDIENTE')])[1]")
        .pause(1000)
        .useXpath()
        .waitForElementVisible("(//*[contains(text(),'Datos exitosamente almacenados ')])[1]")
        .pause(1000)
        .end();

      }
  }