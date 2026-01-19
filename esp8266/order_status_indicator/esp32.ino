#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

const char* ssid = "WiFi";
const char* password = "R0!e###.";


#define LED_PLACED       5
#define LED_PROCESSING   4
#define LED_DELIVERED    2

enum OrderStatus {
  STATUS_IDLE = 0,
  STATUS_PLACED = 1,
  STATUS_PROCESSING = 2,
  STATUS_DELIVERED = 3
};

OrderStatus currentStatus = STATUS_IDLE;

WebServer server(80);

void updateLEDs(OrderStatus status) {
  digitalWrite(LED_PLACED, LOW);
  digitalWrite(LED_PROCESSING, LOW);
  digitalWrite(LED_DELIVERED, LOW);

  switch (status) {
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
    Serial.println("JSON parsing failed");
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  const char* status = doc["status"];
  int led = doc["led"];

  updateLEDs((OrderStatus)led);

  String response =
    "{\"success\":true,\"status\":\"" + String(status) +
    "\",\"led\":" + String(led) + "}";

  server.send(200, "application/json", response);
}

void handleStatusRequest() {
  String statusStr;

  switch (currentStatus) {
    case STATUS_IDLE:       statusStr = "idle"; break;
    case STATUS_PLACED:     statusStr = "placed"; break;
    case STATUS_PROCESSING: statusStr = "processing"; break;
    case STATUS_DELIVERED:  statusStr = "delivered"; break;
  }

  String response =
    "{\"status\":\"" + statusStr +
    "\",\"led\":" + String(currentStatus) +
    ",\"ip\":\"" + WiFi.localIP().toString() + "\"}";

  server.send(200, "application/json", response);
}

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><title>IoT Order Status</title>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<style>body{font-family:Arial;margin:20px;background:#f0f0f0;}";
  html += ".container{background:white;padding:20px;border-radius:10px;max-width:600px;margin:auto;}";
  html += ".status{padding:15px;margin:10px 0;border-radius:5px;font-weight:bold;}";
  html += ".idle{background:#e0e0e0;}.placed{background:#ffd700;}";
  html += ".processing{background:#4169e1;color:#fff;}";
  html += ".delivered{background:#32cd32;color:#fff;}</style></head><body>";
  html += "<div class='container'><h1>🍽️ IoT Order Status</h1>";
  html += "<p><strong>Device IP:</strong> " + WiFi.localIP().toString() + "</p>";

  String statusClass, statusText;
  switch (currentStatus) {
    case STATUS_IDLE: statusClass = "idle"; statusText = "IDLE"; break;
    case STATUS_PLACED: statusClass = "placed"; statusText = "ORDER PLACED"; break;
    case STATUS_PROCESSING: statusClass = "processing"; statusText = "PROCESSING"; break;
    case STATUS_DELIVERED: statusClass = "delivered"; statusText = "DELIVERED"; break;
  }

  html += "<div class='status " + statusClass + "'>Current Status: " + statusText + "</div>";
  html += "<p><strong>API:</strong><br>POST /update<br>GET /status</p>";
  html += "</div></body></html>";
  server.send(200, "text/html", html);
}

void setup() {
  Serial.begin(115200);
  Serial.println("\nESP32 IoT Order Status Starting...");

  pinMode(LED_PLACED, OUTPUT);
  pinMode(LED_PROCESSING, OUTPUT);
  pinMode(LED_DELIVERED, OUTPUT);

  updateLEDs(STATUS_IDLE);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/update", handleStatusUpdate);
  server.on("/status", handleStatusRequest);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}
