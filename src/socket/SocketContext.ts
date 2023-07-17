import React from "react";
import { Socket } from "socket.io-client";

interface Values {
    socket: Socket | null
}

export const SocketContext = React.createContext<Values | null>(null);