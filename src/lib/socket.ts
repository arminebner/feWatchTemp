import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '#/lib/config'

// Singleton socket instance shared across the app.
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
})
