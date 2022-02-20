import http from 'k6/http';
import {sleep , check} from 'k6';

export let options = {
    stages : [
        {
            vus:100, duration:'5s', target:100
        },
        {
            vus:100,duration:'15s',target:100
        },
        {
            vus:100, duration:'10',target:100
        }
    ]
};
export function setup() {

    let url = "https://test.agetic.gob.bo/fichas-medicas/api/api/public/login"  //Api post de login SIVE
    var payload = JSON.stringify({
        password: "U2FsdGVkX1/J3Z405w5c46GHMq7An+uaUiuFvtNDom8=",
        usuario	:"U2FsdGVkX1+HeWhmkMffsYl9fMpRLjG/PllGcw6VUw4="
    });
    
    var headers = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    let result = {}
    result = http.post(url,payload,headers);

    let body = JSON.parse( result.body );

    //let respon = body.hasOwnProperty("token");
    let authToken = body.datos.token;
    console.log(authToken);
    //console.log(JSON.stringify(result.body));
    check(authToken, { 'logged in successfully': () => authToken !== '' });
    return authToken;
  }
  

  export default function(authToken){
    let url= 'https://test.agetic.gob.bo/fichas-medicas/api/api/departamento';
    let headers = {
        headers:{
            'Authorization': authToken
        }
    }

    var result = http.get(url,headers);
    //console.log('API / DEPARTAMENTO')
    console.log(result.status);
    //console.log(result.body);
    check(result, {
        'status was 200': r => r.status == 200
    });
    sleep(1);

    }
