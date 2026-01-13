import requests
import logging

logger = logging.getLogger(__name__)

class ESP8266Controller:
    def __init__(self, ip_address, port=80):
        self.base_url = f"http://{ip_address}:{port}"
        self.timeout = 5
    
    def send_status_update(self, table_id, status):
        """
        Send status update to ESP8266
        status values: 'placed' -> LED1, 'processing' -> LED2, 'delivered' -> LED3
        """
        try:
            status_map = {
                'placed': 1,
                'processing': 2,
                'delivered': 3,
                'available': 0
            }
            
            led_number = status_map.get(status, 0)
            
            response = requests.get(
                f"{self.base_url}/update",
                params={'table': table_id, 'led': led_number},
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                logger.info(f"Status update sent to ESP8266: Table {table_id}, LED {led_number}")
                return True
            else:
                logger.error(f"ESP8266 responded with status code: {response.status_code}")
                return False
                
        except requests.exceptions.Timeout:
            logger.error(f"Timeout connecting to ESP8266 at {self.base_url}")
            return False
        except requests.exceptions.ConnectionError:
            logger.error(f"Connection error to ESP8266 at {self.base_url}")
            return False
        except Exception as e:
            logger.error(f"Failed to send update to ESP8266: {str(e)}")
            return False
    
    def check_device_status(self):
        """Check if ESP8266 is online"""
        try:
            response = requests.get(f"{self.base_url}/status", timeout=3)
            return response.status_code == 200
        except:
            return False