import socketio

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
)

socket_app = socketio.ASGIApp(sio)

class WebSocketService:
    @staticmethod
    async def emit_status_update(table_data: dict):
        """Emit status update to all connected clients"""
        await sio.emit('status_update', table_data)

    @staticmethod
    async def emit_table_added(table_data: dict):
        """Emit when a new table is added"""
        await sio.emit('table_added', table_data)

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

ws_service = WebSocketService()