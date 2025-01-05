#include <WiFi.h>
#include <HTTPClient.h>

// Configuración de red Wi-Fi
const char* ssid = "Tu_SSID"; // Reemplaza con el nombre de tu red Wi-Fi
const char* password = "Tu_PASSWORD"; // Reemplaza con la contraseña de tu red Wi-Fi

// Dirección del backend
const char* serverUrl = "http://<IP_DEL_BACKEND>:8000/api/v1/events"; // Cambia por tu IP y endpoint del backend

// Pines del sensor
const int sensorPin = 13; // PIN donde está conectado el sensor PIR
const int ledPin = 2;     // LED para indicar actividad (opcional)

// Variables del sensor
bool sensorState = false;
bool lastSensorState = false;

void setup() {
  // Inicialización serial
  Serial.begin(115200);

  // Configuración de pines
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);

  // Conexión Wi-Fi
  connectToWiFi();
}

void loop() {
  // Leer el estado del sensor
  sensorState = digitalRead(sensorPin);

  // Detectar cambios en el estado del sensor
  if (sensorState != lastSensorState) {
    if (sensorState) {
      Serial.println("Movimiento detectado");
      sendEventToServer("movimiento");
    } else {
      Serial.println("Sin movimiento");
    }
    lastSensorState = sensorState;
  }

  delay(500); // Pequeña pausa para evitar lecturas constantes
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

void sendEventToServer(const char* eventType) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);

    // Configurar cabecera HTTP
    http.addHeader("Content-Type", "application/json");

    // Construir el cuerpo de la solicitud
    String requestBody = String("{\"type_evento\": \"") + eventType + "\"}";

    // Enviar solicitud POST
    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Respuesta del servidor:");
      Serial.println(response);
    } else {
      Serial.print("Error en la solicitud: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("Wi-Fi no conectado");
  }
}
