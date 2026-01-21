#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h> // Make sure to install ArduinoJson library

// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API
const char* serverUrl = "http://192.168.1.100:8000/api/iot/table-status"; // Replace with your PC IP
const char* tableId = "TABLE_002"; // Unique ID for this device

// LED Pins (D1, D2, D3 usually map to GPIO 5, 4, 0 usually but check pinout)
const int ledPlaced = D1;
const int ledProcessing = D2;
const int ledDelivered = D3;

void setup() {
  Serial.begin(115200);
  
  pinMode(ledPlaced, OUTPUT);
  pinMode(ledProcessing, OUTPUT);
  pinMode(ledDelivered, OUTPUT);
  
  // Turn off LEDs initially
  digitalWrite(ledPlaced, LOW);
  digitalWrite(ledProcessing, LOW);
  digitalWrite(ledDelivered, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Create JSON request
    String requestBody = "{\"tableId\":\"" + String(tableId) + "\"}";
    
    int httpResponseCode = http.POST(requestBody);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
      
      // Parse JSON
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, response);

      if (!error) {
        const char* status = doc["status"];
        updateLEDs(status);
      } else {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  
  delay(5000); // Poll every 5 seconds
}

void updateLEDs(String status) {
  // Reset all
  digitalWrite(ledPlaced, LOW);
  digitalWrite(ledProcessing, LOW);
  digitalWrite(ledDelivered, LOW);
  
  if (status == "placed") {
    digitalWrite(ledPlaced, HIGH);
  } else if (status == "processing") {
    digitalWrite(ledProcessing, HIGH);
  } else if (status == "delivered") {
    digitalWrite(ledDelivered, HIGH);
  }
}
