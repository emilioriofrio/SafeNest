import requests

url = "http://tight-lexis-safenest-83078a32.koyeb.app/register"

for i in range(1, 21):
    payload = {
        "nombre": f"Usuario{i} Apellido{i}",
        "correo": f"usuario{i}@example.com",
        "contrasena": "password123",
        "rol": "colaborador"
    }
    response = requests.post(url, json=payload)
    print(f"Usuario {i} registrado: {response.status_code} - {response.json()}")
