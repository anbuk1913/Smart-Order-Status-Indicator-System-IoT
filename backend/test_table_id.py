import asyncio
import json

import httpx

# Test configuration
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/auth/login"
TABLES_URL = f"{BASE_URL}/tables"

# Test credentials (adjust as needed)
TEST_USERNAME = "admin"
TEST_PASSWORD = "admin123"


async def get_auth_token():
    """Get authentication token for API calls"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            LOGIN_URL,
            data={"username": TEST_USERNAME, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        if response.status_code == 200:
            token_data = response.json()
            return token_data["access_token"]
        else:
            print(f"Failed to get auth token: {response.status_code} - {response.text}")
            return None


async def test_table_operations():
    """Test table CRUD operations with ID handling"""

    # Get auth token
    token = await get_auth_token()
    if not token:
        print("❌ Failed to authenticate")
        return

    print("✅ Authentication successful")

    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient() as client:
        # Test 1: Create a new table
        print("\n🔧 Test 1: Creating a new table...")
        create_response = await client.post(
            TABLES_URL, json={"tableName": "Test Table ID Fix"}, headers=headers
        )

        if create_response.status_code == 201:
            table_data = create_response.json()
            table_id = table_data["id"]
            print(f"✅ Table created successfully with ID: {table_id}")
            print(f"   Table data: {json.dumps(table_data, indent=2)}")
        else:
            print(
                f"❌ Failed to create table: {create_response.status_code} - {create_response.text}"
            )
            return

        # Test 2: Get all tables
        print("\n🔧 Test 2: Getting all tables...")
        list_response = await client.get(TABLES_URL, headers=headers)

        if list_response.status_code == 200:
            tables = list_response.json()
            print(f"✅ Retrieved {len(tables)} tables")
            for table in tables:
                print(
                    f"   - {table['tableName']} (ID: {table['id']}, Status: {table['status']})"
                )
        else:
            print(
                f"❌ Failed to get tables: {list_response.status_code} - {list_response.text}"
            )

        # Test 3: Get specific table by ID
        print(f"\n🔧 Test 3: Getting table by ID ({table_id})...")
        get_response = await client.get(f"{TABLES_URL}/{table_id}", headers=headers)

        if get_response.status_code == 200:
            table_data = get_response.json()
            print(f"✅ Retrieved table successfully")
            print(f"   Table data: {json.dumps(table_data, indent=2)}")
        else:
            print(
                f"❌ Failed to get table: {get_response.status_code} - {get_response.text}"
            )

        # Test 4: Update table name
        print(f"\n🔧 Test 4: Updating table name...")
        update_response = await client.put(
            f"{TABLES_URL}/{table_id}",
            json={"tableName": "Updated Test Table"},
            headers=headers,
        )

        if update_response.status_code == 200:
            table_data = update_response.json()
            print(f"✅ Table name updated successfully")
            print(f"   New name: {table_data['tableName']}")
        else:
            print(
                f"❌ Failed to update table: {update_response.status_code} - {update_response.text}"
            )

        # Test 5: Update table status
        print(f"\n🔧 Test 5: Updating table status...")
        status_response = await client.patch(
            f"{TABLES_URL}/{table_id}/status",
            json={"status": "placed"},
            headers=headers,
        )

        if status_response.status_code == 200:
            table_data = status_response.json()
            print(f"✅ Table status updated successfully")
            print(f"   New status: {table_data['status']}")
        else:
            print(
                f"❌ Failed to update status: {status_response.status_code} - {status_response.text}"
            )

        # Test 6: Update status to processing
        print(f"\n🔧 Test 6: Updating status to processing...")
        status_response = await client.patch(
            f"{TABLES_URL}/{table_id}/status",
            json={"status": "processing"},
            headers=headers,
        )

        if status_response.status_code == 200:
            table_data = status_response.json()
            print(f"✅ Status updated to processing")
            print(f"   Current status: {table_data['status']}")
        else:
            print(
                f"❌ Failed to update to processing: {status_response.status_code} - {status_response.text}"
            )

        # Test 7: Update status to delivered
        print(f"\n🔧 Test 7: Updating status to delivered...")
        status_response = await client.patch(
            f"{TABLES_URL}/{table_id}/status",
            json={"status": "delivered"},
            headers=headers,
        )

        if status_response.status_code == 200:
            table_data = status_response.json()
            print(f"✅ Status updated to delivered")
            print(f"   Current status: {table_data['status']}")
        else:
            print(
                f"❌ Failed to update to delivered: {status_response.status_code} - {status_response.text}"
            )

        # Test 8: Reset status to idle
        print(f"\n🔧 Test 8: Resetting status to idle...")
        status_response = await client.patch(
            f"{TABLES_URL}/{table_id}/status", json={"status": "idle"}, headers=headers
        )

        if status_response.status_code == 200:
            table_data = status_response.json()
            print(f"✅ Status reset to idle")
            print(f"   Current status: {table_data['status']}")
        else:
            print(
                f"❌ Failed to reset status: {status_response.status_code} - {status_response.text}"
            )

        # Test 9: Delete table
        print(f"\n🔧 Test 9: Deleting test table...")
        delete_response = await client.delete(
            f"{TABLES_URL}/{table_id}", headers=headers
        )

        if delete_response.status_code == 204:
            print(f"✅ Table deleted successfully")
        else:
            print(
                f"❌ Failed to delete table: {delete_response.status_code} - {delete_response.text}"
            )

        # Test 10: Verify deletion
        print(f"\n🔧 Test 10: Verifying table deletion...")
        get_response = await client.get(f"{TABLES_URL}/{table_id}", headers=headers)

        if get_response.status_code == 404:
            print(f"✅ Table deletion verified (404 as expected)")
        else:
            print(f"❌ Table still exists: {get_response.status_code}")


async def main():
    print("🚀 Starting Table ID Test Suite")
    print("=" * 50)

    try:
        await test_table_operations()
        print("\n" + "=" * 50)
        print("✅ Test suite completed!")
    except Exception as e:
        print(f"\n❌ Test suite failed with error: {str(e)}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
