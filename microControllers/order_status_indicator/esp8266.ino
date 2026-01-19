#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

const char* ssid = "WiFi";
const char* password = "R0!e###.";

#define LED_PLACED 5
#define LED_PROCESSING 4
#define LED_DELIVERED 0

enum OrderStatus {
  STATUS_IDLE = 0,
  STATUS_PLACED = 1,
  STATUS_PROCESSING = 2,
  STATUS_DELIVERED = 3
};

OrderStatus currentStatus = STATUS_IDLE;

ESP8266WebServer server(80);

void updateLEDs(OrderStatus status){
  digitalWrite(LED_PLACED, 0);
  digitalWrite(LED_PROCESSING, 0);
  digitalWrite(LED_DELIVERED, 0);
  
  switch(status) {
    case STATUS_IDLE:
      break;
      
    case STATUS_PLACED:
      digitalWrite(LED_PLACED, HIGH);
      Serial.println("Status: Order Placed (LED 1 ON)");
      break;
      
    case STATUS_PROCESSING:
      digitalWrite(LED_PROCESSING, HIGH);
      Serial.println("Status: Processing (LED 2 ON)");
      break;
      
    case STATUS_DELIVERED:
      digitalWrite(LED_DELIVERED, HIGH);
      Serial.println("Status: Delivered (LED 3 ON)");
      break;
  }
  currentStatus = status;
}

void handleStatusUpdate() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method Not Allowed");
    return;
  }

  String body = server.arg("plain");
  Serial.println("Received: " + body);

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, body);

  if (error) {
    Serial.print("JSON parsing failed: ");
    Serial.println(error.c_str());
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  const char* status = doc["status"];
  int led = doc["led"];

  Serial.print("Status: ");
  Serial.print(status);
  Serial.print(", LED: ");
  Serial.println(led);

  updateLEDs((OrderStatus)led);

  String response = "{\"success\":true,\"status\":\"" + String(status) + "\",\"led\":" + String(led) + "}";
  server.send(200, "application/json", response);
}

void handleStatusRequest() {
  String statusStr;
  
  switch(currentStatus) {
    case STATUS_IDLE:
      statusStr = "idle";
      break;
    case STATUS_PLACED:
      statusStr = "placed";
      break;
    case STATUS_PROCESSING:
      statusStr = "processing";
      break;
    case STATUS_DELIVERED:
      statusStr = "delivered";
      break;
  }

  String response = "{\"status\":\"" + statusStr + "\",\"led\":" + String(currentStatus) + ",\"ip\":\"" + WiFi.localIP().toString() + "\"}";
  server.send(200, "application/json", response);
}

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><title>IoT Order Status</title>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<style>body{font-family:Arial;margin:20px;background:#f0f0f0;}";
  html += ".container{background:white;padding:20px;border-radius:10px;max-width:600px;margin:auto;}";
  html += "h1{color:#333;}.status{padding:15px;margin:10px 0;border-radius:5px;font-weight:bold;}";
  html += ".idle{background:#e0e0e0;}.placed{background:#ffd700;color:#000;}";
  html += ".processing{background:#4169e1;color:#fff;}.delivered{background:#32cd32;color:#fff;}";
  html += ".led{display:inline-block;width:20px;height:20px;border-radius:50%;margin-right:10px;}";
  html += ".led-on{box-shadow:0 0 10px currentColor;}.info{background:#e3f2fd;padding:10px;border-radius:5px;margin-top:20px;}";
  html += "</style></head><body>";
  html += "<div class='container'>";
  html += "<h1>🍽️ IoT Order Status System</h1>";
  html += "<div class='info'><strong>Device IP:</strong> " + WiFi.localIP().toString() + "</div>";
  
  String statusClass, statusText;
  switch(currentStatus) {
    case STATUS_IDLE:
      statusClass = "idle";
      statusText = "IDLE";
      break;
    case STATUS_PLACED:
      statusClass = "placed";
      statusText = "ORDER PLACED";
      break;
    case STATUS_PROCESSING:
      statusClass = "processing";
      statusText = "PROCESSING";
      break;
    case STATUS_DELIVERED:
      statusClass = "delivered";
      statusText = "DELIVERED";
      break;
  }
  
  html += "<div class='status " + statusClass + "'>Current Status: " + statusText + "</div>";
  
  html += "<h3>LED Status:</h3>";
  html += "<div><span class='led' style='background:" + String(currentStatus == STATUS_PLACED ? "#ffd700" : "#ccc") + "'></span> LED 1 - Order Placed " + String(currentStatus == STATUS_PLACED ? "✓" : "") + "</div>";
  html += "<div><span class='led' style='background:" + String(currentStatus == STATUS_PROCESSING ? "#4169e1" : "#ccc") + "'></span> LED 2 - Processing " + String(currentStatus == STATUS_PROCESSING ? "✓" : "") + "</div>";
  html += "<div><span class='led' style='background:" + String(currentStatus == STATUS_DELIVERED ? "#32cd32" : "#ccc") + "'></span> LED 3 - Delivered " + String(currentStatus == STATUS_DELIVERED ? "✓" : "") + "</div>";
  
  html += "<div class='info' style='margin-top:20px;'>";
  html += "<strong>API Endpoints:</strong><br>";
  html += "POST /update - Update status<br>";
  html += "GET /status - Get current status";
  html += "</div>";
  
  html += "</div></body></html>";
  
  server.send(200, "text/html", html);
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n\nIoT Order Status Indicator - Starting...");

  pinMode(LED_PLACED, OUTPUT);
  pinMode(LED_PROCESSING, OUTPUT);
  pinMode(LED_DELIVERED, OUTPUT);

  updateLEDs(STATUS_IDLE);

  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  WiFi.mode(WIFI_STA);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    
    for(int i = 0; i < 3; i++) {
      digitalWrite(LED_PLACED, HIGH);
      digitalWrite(LED_PROCESSING, HIGH);
      digitalWrite(LED_DELIVERED, HIGH);
      delay(200);
      digitalWrite(LED_PLACED, LOW);
      digitalWrite(LED_PROCESSING, LOW);
      digitalWrite(LED_DELIVERED, LOW);
      delay(200);
    }
  } else {
    Serial.println("\nWiFi Connection Failed!");
    for(int i = 0; i < 10; i++) {
      digitalWrite(LED_PLACED, !digitalRead(LED_PLACED));
      delay(100);
    }
  }

  server.on("/", handleRoot);
  server.on("/update", handleStatusUpdate);
  server.on("/status", handleStatusRequest);
  server.begin();
  Serial.println("HTTP server started");
  Serial.println("Ready to receive status updates!");
}

void loop() {
  server.handleClient();
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    WiFi.reconnect();
    delay(5000);
  }
}

/*
 * Testing Instructions:
 * 
 * 1. Update WiFi credentials (ssid and password)
 * 2. Upload to ESP8266
 * 3. Open Serial Monitor (115200 baud)
 * 4. Note the IP address shown
 * 5. Update backend .env file with ESP8266_IP
 * 
 * Test with curl:
 * curl -X POST http://YOUR_ESP_IP/update -H "Content-Type: application/json" -d '{"status":"placed","led":1}'
 * curl http://YOUR_ESP_IP/status
 * 
 * Or open browser: http://YOUR_ESP_IP/
 */