import requests
import re
import sys

BASE_URL = "http://localhost:8000"
USERNAME = "chef"
PASSWORD = "chef123"

def verify():
    print("1. Logging in...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json={"username": USERNAME, "password": PASSWORD})
        response.raise_for_status()
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        print("   Success! Token received.")
    except Exception as e:
        print(f"   Failed to login: {e}")
        sys.exit(1)

    print("\n2. Creating Table...")
    try:
        payload = {"tableName": "Verification Table"}
        response = requests.post(f"{BASE_URL}/api/tables/", json=payload, headers=headers)
        if response.status_code != 200:
            print(f"   Failed to create table. Status: {response.status_code}, Body: {response.text}")
            sys.exit(1)
        
        table = response.json()
        print(f"   Table keys: {table.keys()}")
        table_id = table.get("tableId")
        mongo_id = table.get("_id") or table.get("id")
        
        print(f"   Success! Table Created: {table}")
        print(f"   Generated Table ID: {table_id}")
        print(f"   Mongo ID for Update: {mongo_id}")
    except Exception as e:
        print(f"   Failed to create table: {e}")
        sys.exit(1)

    print("\n3. Verifying ID Format...")
    if not table_id or len(table_id) != 6:
        print(f"   FAIL: ID length is not 6. Got: {table_id}")
        sys.exit(1)
    
    letters = sum(c.isalpha() for c in table_id)
    digits = sum(c.isdigit() for c in table_id)
    
    if letters != 3 or digits != 3:
        print(f"   FAIL: ID should have 3 letters and 3 digits. Got: {letters} letters, {digits} digits.")
        sys.exit(1)
    print("   Success! ID format follows 3 letters + 3 digits.")

    print("\n4. Updating Table...")
    try:
        update_payload = {"tableName": "Updated Verification Table", "status": "processing"}
        response = requests.put(f"{BASE_URL}/api/tables/{mongo_id}", json=update_payload, headers=headers)
        if response.status_code != 200:
            print(f"   Failed to update table. Status: {response.status_code}, Body: {response.text}")
            sys.exit(1)
            
        updated_table = response.json()
        if updated_table.get("tableName") != "Updated Verification Table" or updated_table.get("status") != "processing":
            print(f"   FAIL: Update not reflected. Got: {updated_table}")
            sys.exit(1)
            
        print("   Success! Table updated correctly.")
    except Exception as e:
        print(f"   Failed to update table: {e}")
        sys.exit(1)

    print("\n5. Cleaning up (Deleting Table)...")
    try:
        response = requests.delete(f"{BASE_URL}/api/tables/{mongo_id}", headers=headers)
        if response.status_code == 200:
             print("   Success! Table deleted.")
        else:
             print(f"   Warning: Failed to delete table. Status: {response.status_code}")
    except Exception as e:
        print(f"   Warning: Failed to delete table: {e}")

    print("\nAll verification steps passed!")

if __name__ == "__main__":
    verify()
