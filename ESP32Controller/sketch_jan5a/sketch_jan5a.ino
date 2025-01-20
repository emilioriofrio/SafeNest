#include <WiFi.h>
#include <HTTPClient.h>

// Configuración de red Wi-Fi
const char* ssid = "Emilio"; 
const char* password = "holaaaaa"; 

// Dirección del backend
const char* serverUrl = "https://tight-lexis-safenest-83078a32.koyeb.app/logs"; 

// Pines de los sensores
const int sensorSonido1 = 34; 
const int sensorSonido2 = 32; 
const int sensorMovimiento1 = 33; 
const int sensorMovimiento2 = 35;

// IDs de los sensores en la base de datos
const int sensorSonido1ID = 1; 
const int sensorSonido2ID = 5; 
const int sensorMovimiento1ID = 3; 
const int sensorMovimiento2ID = 6;

void setup() {
  Serial.begin(115200);

  // Configuración de pines
  pinMode(sensorSonido1, INPUT);
  pinMode(sensorSonido2, INPUT);
  pinMode(sensorMovimiento1, INPUT);
  pinMode(sensorMovimiento2, INPUT);

  // Conexión Wi-Fi
  connectToWiFi();
}

void loop() {
  // Leer estados de los sensores
  bool sonido1Estado = digitalRead(sensorSonido1);
  bool sonido2Estado = digitalRead(sensorSonido2);
  bool movimiento1Estado = digitalRead(sensorMovimiento1);
  bool movimiento2Estado = digitalRead(sensorMovimiento2);

  // Enviar datos al backend para cada sensor
  if (!sendEventToServer(sensorSonido1ID, sonido1Estado)) {
    Serial.println("Error enviando datos del sensorSonido1.");
  }
  if (!sendEventToServer(sensorSonido2ID, sonido2Estado)) {
    Serial.println("Error enviando datos del sensorSonido2.");
  }
  if (!sendEventToServer(sensorMovimiento1ID, movimiento1Estado)) {
    Serial.println("Error enviando datos del sensorMovimiento1.");
  }
  if (!sendEventToServer(sensorMovimiento2ID, movimiento2Estado)) {
    Serial.println("Error enviando datos del sensorMovimiento2.");
  }

  delay(1000); // Enviar datos cada segundo
}

void connectToWiFi() {
  Serial.println("Conectando a Wi-Fi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nConectado a Wi-Fi");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());
}

bool sendEventToServer(int sensorId, bool estado) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);

    // Configurar cabecera HTTP
    http.addHeader("Content-Type", "application/json");

    // Construir el cuerpo de la solicitud
    String requestBody = String("{\"sensor_id\": ") + sensorId + 
                         ", \"estado\": " + (estado ? "1" : "0") + "}";

    // Enviar solicitud POST
    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Respuesta del servidor:");
      Serial.println(response);
      http.end();
      return true; // Envío exitoso
    } else {
      Serial.print("Error en la solicitud: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("Wi-Fi no conectado");
  }
  return false; // Envío fallido
}
