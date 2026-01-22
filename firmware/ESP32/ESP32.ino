#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "Airtel_7904030785";
const char* password = "air46278";

const char* serverUrl = "http://192.168.1.100:8000/api/iot/table-status";
const char* tableId = "TABLE_001";

const int ledPlaced = 12;
const int ledProcessing = 14;
const int ledDelivered = 27;

void setup() {
  Serial.begin(115200);
  
  pinMode(ledPlaced, OUTPUT);
  pinMode(ledProcessing, OUTPUT);
  pinMode(ledDelivered, OUTPUT);
  
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
    HTTPClient http;
    http.begin(serverUrl);
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
  // idle or active=false -> all off (already reset)
}
