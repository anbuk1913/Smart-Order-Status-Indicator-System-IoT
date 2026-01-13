from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

class TableModel:
    def __init__(self, db):
        self.collection = db.tables
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        self.collection.create_index('tableName')
        self.collection.create_index('isActive')
    
    def create_table(self, table_name):
        table = {
            'tableName': table_name,
            'status': 'available',
            'isActive': True,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        result = self.collection.insert_one(table)
        table['_id'] = str(result.inserted_id)
        return table
    
    def get_all_tables(self):
        tables = list(self.collection.find({'isActive': True}).sort('createdAt', 1))
        for table in tables:
            table['_id'] = str(table['_id'])
        return tables
    
    def get_table_by_id(self, table_id):
        try:
            table = self.collection.find_one({'_id': ObjectId(table_id), 'isActive': True})
            if table:
                table['_id'] = str(table['_id'])
            return table
        except:
            return None
    
    def update_table_name(self, table_id, new_name):
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(table_id), 'isActive': True},
                {'$set': {'tableName': new_name, 'updatedAt': datetime.utcnow()}}
            )
            return result.modified_count > 0
        except:
            return False
    
    def update_table_status(self, table_id, status):
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(table_id), 'isActive': True},
                {'$set': {'status': status, 'updatedAt': datetime.utcnow()}}
            )
            return result.modified_count > 0
        except:
            return False
    
    def delete_table(self, table_id):
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(table_id)},
                {'$set': {'isActive': False, 'updatedAt': datetime.utcnow()}}
            )
            return result.modified_count > 0
        except:
            return False