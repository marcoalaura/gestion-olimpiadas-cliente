import http from 'k6/http';
import {sleep , check , group} from 'k6';

export let options = {
    stages : [
        {
            vus:200, duration:'0s', target:200
        },
        {
            vus:200,duration:'10s',target:200
        },
        {
            vus:200, duration:'3',target:200
        }
    ]
};
const URL_BASE ='https://olimpiadas.test.gtic.gob.bo/admin/ws/api' 
export function setup() {

    let url_login = `${URL_BASE}/auth`  //Api post de login SIVE
    var payload = JSON.stringify({
        "usuario":"ADMINISTRADOR","contrasena":"MTIz"
    });
    
    var headers = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    let result = {}
    result = http.post(url_login,payload,headers);

    let body = JSON.parse( result.body );

    //let respon = body.hasOwnProperty("token");
    let authToken = body.datos.access_token;
   // console.log(JSON.stringify(body));
    console.log(authToken);
    //console.log(JSON.stringify(result.body));
    check(authToken, { 'logged in successfully': () => authToken !== '' });

    return authToken;
  }

  export default function(authToken){

    let headers = {
        headers:{
            'Authorization': `Bearer ${authToken}`
        }
    }

    group('Endpoints con tokens', () => {
        let responses = http.batch([
            [
                'GET',
                `${URL_BASE}/areas?limite=10&pagina=1`,null,
                headers,
          ],
          [
              'GET',
              `${URL_BASE}/grados-escolares?limite=10&pagina=1`,null,
            headers,
        ],
        [
            'GET',
            `${URL_BASE}/distritos?limite=10&pagina=1`,null,
            headers,
        ],
          [
              'GET',
              `${URL_BASE}/unidades-educativas?limite=10&pagina=1`,null,
              headers,
            ],
        ]);
        
        console.log('Api 1' + JSON.stringify(responses[0]));
        console.log('Api 2' + JSON.stringify(responses[1]));
        console.log('Api 3' + JSON.stringify(responses[2]));
        console.log('Api 4' + JSON.stringify(responses[3]));
        check(responses[0], {
            'Resultados de peticiónes GET 200': (res) => res.status === 200,
          });
      });

    }
