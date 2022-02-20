import random, string

def generate_random_data():
    return {
        'numero_documento': ''.join(random.choices(string.ascii_uppercase, k=8)),
        'complemento': '',
        'nombres': ''.join(random.choices(string.ascii_uppercase, k=10)),
        'apellidos': ''.join(random.choices(string.ascii_uppercase, k=10)),
        'fecha_nacimiento': '01/01/' + str(random.randrange(1932, 2007)),
        'celular': int('7' + str(random.randrange(1111111, 9999999)))
    }