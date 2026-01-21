// import { useEffect } from 'react';
// import { wsService } from '../services/websocket';
// import type { Table } from '../types/table';

// export const useWebSocket = (onStatusUpdate: (table: Table) => void) => {
//   useEffect(() => {
//     const socket = wsService.connect();

//     socket.on('status_update', (data: Table) => {
//       onStatusUpdate(data);
//     });

//     return () => {
//       wsService.disconnect();
//     };
//   }, [onStatusUpdate]);
// }