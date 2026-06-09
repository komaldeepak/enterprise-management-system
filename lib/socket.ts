import { useNotifications } from './notifications';

// Mock Socket.io Events (in production, connect to actual Socket.io server)
export interface SocketEvent {
  event: 'employee-added' | 'employee-updated' | 'employee-deleted' | 'project-status-changed' | 'activity';
  data: Record<string, unknown>;
  timestamp: number;
}

let mockSocketListeners: Array<(event: SocketEvent) => void> = [];

export function useSocket() {
  const { addNotification } = useNotifications();

  // Simulate real-time events
  const simulateEvent = (event: SocketEvent) => {
    mockSocketListeners.forEach((listener) => listener(event));

    // Add notification for activity
    if (event.event === 'employee-added') {
      addNotification('New employee added', 'success');
    } else if (event.event === 'employee-updated') {
      addNotification('Employee updated', 'info');
    } else if (event.event === 'project-status-changed') {
      addNotification('Project status changed', 'info');
    }
  };

  // Subscribe to events
  const on = (callback: (event: SocketEvent) => void) => {
    mockSocketListeners.push(callback);
    return () => {
      mockSocketListeners = mockSocketListeners.filter((l) => l !== callback);
    };
  };

  // Emit event (in production, would send to server)
  const emit = (event: SocketEvent) => {
    simulateEvent(event);
  };

  return { on, emit, simulateEvent };
}

// Real Socket.io implementation ready:
// import io from 'socket.io-client';
// const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
// socket.on('connect', () => console.log('Connected'));
// socket.emit('event', data);
// socket.on('event', (data) => { ... });
