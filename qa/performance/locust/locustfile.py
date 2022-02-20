from utils import generate_random_data
from locust import HttpUser, task, constant

class MainTest(HttpUser):
    wait_time = constant(1)


    @task()
    def main_task(self):
        beneficiarioR = generate_random_data()
        try:
            data = {
                "solicitud": {
                    "numero_documento": beneficiarioR['numero_documento'],
                    "complemento": "",
                    "fecha_nacimiento": beneficiarioR['fecha_nacimiento'],
                    "celular": beneficiarioR['celular'],
                    "nombres": beneficiarioR['nombres'],
                    "apellidos": beneficiarioR['apellidos']
                }
            }

            with self.client.post("/personas/solicitud_saldo", json=data, catch_response=True) as response:
                if (response.status_code == 200):
                    response.success()
        except Exception as e:
            print(str(e))