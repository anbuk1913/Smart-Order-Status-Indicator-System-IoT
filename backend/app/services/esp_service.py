import requests
from app.config import get_settings
from app.models.table import OrderStatus

settings = get_settings()

class ESPService:
    def __init__(self):
        self.esp_ip = settings.esp8266_ip
        self.base_url = f"http://{self.esp_ip}"

    def send_status_update(self, status: str):
        """Send status update to ESP8266"""
        try:
            led_mapping = {
                OrderStatus.IDLE: 0,
                OrderStatus.PLACED: 1,
                OrderStatus.PROCESSING: 2,
                OrderStatus.DELIVERED: 3
            }
            
            led_num = led_mapping.get(status, 0)
            
            response = requests.post(
                f"{self.base_url}/update",
                json={"status": status, "led": led_num},
                timeout=5
            )
            
            if response.status_code == 200:
                print(f"Status update sent to ESP8266: {status}")
                return True
            else:
                print(f"Failed to send status to ESP8266: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"Error communicating with ESP8266: {e}")
            return False

    def check_connection(self):
        """Check if ESP8266 is reachable"""
        try:
            response = requests.get(f"{self.base_url}/status", timeout=3)
            return response.status_code == 200
        except:
            return False

esp_service = ESPService()