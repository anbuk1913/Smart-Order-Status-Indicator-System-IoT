from flask import Blueprint, request, jsonify
from flask_socketio import emit
from routes.auth import token_required
import logging

logger = logging.getLogger(__name__)

tables_bp = Blueprint('tables', __name__)

def init_tables_routes(table_model, esp_controller, socketio):
    
    @tables_bp.route('/tables', methods=['GET'])
    @token_required
    def get_tables():
        try:
            tables = table_model.get_all_tables()
            return jsonify({'success': True, 'tables': tables})
        except Exception as e:
            logger.error(f"Error fetching tables: {str(e)}")
            return jsonify({'success': False, 'error': 'Failed to fetch tables'}), 500
    
    @tables_bp.route('/tables', methods=['POST'])
    @token_required
    def create_table():
        try:
            data = request.get_json()
            table_name = data.get('tableName')
            
            if not table_name or not table_name.strip():
                return jsonify({'success': False, 'error': 'Table name is required'}), 400
            
            table = table_model.create_table(table_name.strip())
            
            socketio.emit('table_created', table)
            
            return jsonify({'success': True, 'table': table}), 201
        except Exception as e:
            logger.error(f"Error creating table: {str(e)}")
            return jsonify({'success': False, 'error': 'Failed to create table'}), 500
    
    @tables_bp.route('/tables/<table_id>', methods=['GET'])
    @token_required
    def get_table(table_id):
        try:
            table = table_model.get_table_by_id(table_id)
            
            if not table:
                return jsonify({'success': False, 'error': 'Table not found'}), 404
            
            return jsonify({'success': True, 'table': table})
        except Exception as e:
            logger.error(f"Error fetching table: {str(e)}")
            return jsonify({'success': False, 'error': 'Failed to fetch table'}), 500
    
    @tables_bp.route('/tables/<table_id>/rename', methods=['PUT'])
    @token_required
    def rename_table(table_id):
        try:
            data = request.get_json()
            new_name = data.get('tableName')
            
            if not new_name or not new_name.strip():
                return jsonify({'success': False, 'error': 'New name is required'}), 400
            
            success = table_model.update_table_name(table_id, new_name.strip())
            
            if success:
                table = table_model.get_table_by_id(table_id)
                socketio.emit('table_updated', table)
                return jsonify({'success': True, 'table': table})
            
            return jsonify({'success': False, 'error': 'Failed to update table'}), 400
        except Exception as e:
            logger.error(f"Error renaming table: {str(e)}")
            return jsonify({'success': False, 'error': 'Failed to rename table'}), 500
    
    @tables_bp.route('/tables/<table_id>/status', methods=['PUT'])
    @token_required
    def update_status(table_id):
        try:
            data = request.get_json()
            status = data.get('status')
            
            valid_statuses = ['available', 'placed', 'processing', 'delivered']
            if status not in valid_statuses:
                return jsonify({
                    'success': False, 
                    'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
                }), 400
            
            success = table_model.update_table_status(table_id, status)
            
            if success:
                # Send update to ESP8266
                esp_result = esp_controller.send_status_update(table_id, status)
                
                table = table_model.get_table_by_id(table_id)
                socketio.emit('status_updated', table)
                
                return jsonify({
                    'success': True, 
                    'table': table,
                    'esp8266_updated': esp_result
                })
            
            return jsonify({'success': False, 'error': 'Failed to update status'}), 400
        except Exception as e:
            logger.error(f"Error updating status: {str(e)}")
            return jsonify({'success': False, 'error': 'Failed to update status'}), 500
    
    @tables_bp.route('/tables/<table_id>', methods=['DELETE'])
    @token_required
    def delete_table(table_id):
        try:
            success = table_model.delete_table(table_id)
            
            if success:
                socketio.emit('table_deleted', {'tableId': table_id})
                return jsonify({'success': True, 'message': 'Table deleted successfully'})
            
            return jsonify({'success': False, 'error': 'Failed to delete table'}), 400
        except Exception as e:
            logger.error(f"Error deleting table: {str(e)}")
            return jsonify({'success': False, 'error': 'Failed to delete table'}), 500
    
    @tables_bp.route('/device/status', methods=['GET'])
    @token_required
    def device_status():
        try:
            is_online = esp_controller.check_device_status()
            return jsonify({
                'success': True, 
                'online': is_online,
                'ip': esp_controller.base_url
            })
        except Exception as e:
            logger.error(f"Error checking device status: {str(e)}")
            return jsonify({
                'success': False, 
                'online': False,
                'error': 'Failed to check device status'
            })
    
    return tables_bp