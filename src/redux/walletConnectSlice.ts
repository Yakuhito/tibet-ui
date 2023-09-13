import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import WalletConnect from '../utils/walletIntegration/wallets/walletConnect';
import type { SessionTypes } from "@walletconnect/types";
import { toast } from 'react-hot-toast';

export interface WalletConnectState {
  sessions: SessionTypes.Struct[] | [];
  selectedSession: SessionTypes.Struct | null | void;
  selectedFingerprint: number | null;
}

// ASYNC
/////////////////////////////////
export const getAllSessions = createAsyncThunk('wallet/getAllSessions', async () => {
  try {
    const walletConnect = new WalletConnect();
    const sessions = await walletConnect.getAllSessions();
    return sessions
  } catch (error: any) {
    if (error.message) {
      toast.error(`WalletConnect - ${error.message}`);
    }
    throw error;
  }
});

export const connectSession = createAsyncThunk('wallet/connectSession', async () => {
  try {
    const walletConnect = new WalletConnect();
    const newSession = await walletConnect.connectSession();
    return newSession
  } catch (error: any) {
    if (error.message) {
      toast.error(`WalletConnect - ${error.message}`);
    }
    throw error;
  }
});


export const disconnectSession = createAsyncThunk('wallet/disconnectSession', async (topic: string) => {
  try {
    const walletConnect = new WalletConnect();
    const response = await walletConnect.disconnectSession(topic);
    return topic;
  } catch (error: any) {
    if (error.message) {
      toast.error(`WalletConnect - ${error.message}`);
    }
    throw error;
  }
});


// SLICES
/////////////////////////////////
const initialState: WalletConnectState = {
  sessions: [],
  selectedSession: null,
  selectedFingerprint: null,
};

const walletConnectSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    selectSession(state, action: PayloadAction<string>) {
      const topicToSelect = action.payload;

      // Check if the provided session topic is in the sessions array
      const selectedSession = state.sessions.find(session => session.topic === topicToSelect);

      if (selectedSession) {
        state.selectedSession = selectedSession;
        state.selectedFingerprint = Number(state.selectedSession.namespaces.chia.accounts[0].split(":")[2]);
      } else {
        // Provided session topic is not valid
        console.error(`Invalid session topic: ${topicToSelect}`);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // GET ALL SESSIONS
      //////////////////////////////////
      .addCase(getAllSessions.fulfilled, (state, action) => {
        state.sessions = action.payload || [];
      })
      // CONNECT SESSION
      //////////////////////////////////
      .addCase(connectSession.fulfilled, (state, action) => {
        const newSession = action.payload;
        // Set the active session as the newly connected one
        if (newSession) {
          state.selectedSession = newSession;
          state.selectedFingerprint = Number(newSession.namespaces.chia.accounts[0].split(":")[2]);
        }
      })
      // DISCONNECT SESSION
      //////////////////////////////////
      .addCase(disconnectSession.fulfilled, (state, action) => {
        const disconnectedTopic = action.payload;

        // If no more sessions exist, set selectedSession to null
        if (!state.sessions.length) {
          state.selectedSession = null;
          state.selectedFingerprint = null;
          return
        }

        // If user disconnects the currently selected session, select the next available one
        if (state.sessions.length && state.selectedSession && disconnectedTopic === state.selectedSession.topic) {
          state.selectedSession = state.sessions[state.sessions.length-1];
          state.selectedFingerprint = Number(state.selectedSession.namespaces.chia.accounts[0].split(":")[2]);
        }

      })
  },
});

export const { selectSession } = walletConnectSlice.actions;

export default walletConnectSlice.reducer;
