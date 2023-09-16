import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import WalletConnect from '../utils/walletIntegration/wallets/walletConnect';
import type { SessionTypes } from "@walletconnect/types";
import { toast } from 'react-hot-toast';


export interface WalletConnectState {
  sessions: SessionTypes.Struct[] | [];
  selectedSession: SessionTypes.Struct | null | void;
  selectedFingerprint: {
    [topic: string]: number;
  }
  pairingUri: string | null;
}

// ASYNC
/////////////////////////////////
export const getAllSessions = createAsyncThunk('wallet/getAllSessions', async () => {
  try {
    const walletConnect = new WalletConnect();
    const sessions = await walletConnect.getAllSessions();
    if (sessions) {
      return sessions
    } else {
      throw Error('No WC sessions found');
    }
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
    await walletConnect.disconnectSession(topic);
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
  selectedFingerprint: {},
  pairingUri: null
};

const walletConnectSlice = createSlice({
  name: 'walletConnect',
  initialState,
  reducers: {
    selectSession(state, action: PayloadAction<string>) {
      const topic = action.payload;

      // Check if the provided session topic is in the sessions array
      const selectedSession = state.sessions.find(session => session.topic === topic);

      if (selectedSession) {
        state.selectedSession = selectedSession;
      } else {
        // Provided session topic is not valid
        console.error(`Invalid session topic: ${topic}`);
      }
    },

    setSelectedFingerprint(state, action: PayloadAction<{topic: string, selectedFingerprint: number}>) {
      const { topic, selectedFingerprint } = action.payload;
      state.selectedFingerprint[topic] = selectedFingerprint;
    },

    setPairingUri(state, action: PayloadAction<string | null>) {
      const uri = action.payload;
      state.pairingUri = uri;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL SESSIONS
      //////////////////////////////////
      .addCase(getAllSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      })
      // CONNECT SESSION
      //////////////////////////////////
      .addCase(connectSession.fulfilled, (state, action) => {
        const newSession = action.payload;
        // Set the active session as the newly connected one
        if (newSession) {
          state.selectedSession = newSession;
          state.selectedFingerprint[newSession.topic] = Number(newSession.namespaces.chia.accounts[0].split(":")[2]);
        }
      })
      // DISCONNECT SESSION
      //////////////////////////////////
      .addCase(disconnectSession.fulfilled, (state, action) => {
        const disconnectedTopic = action.payload;

        // Remove any saved fingerprint preference if any
        if (disconnectedTopic in state.selectedFingerprint) {
          delete state.selectedFingerprint[disconnectedTopic];
        }

        // If no more sessions exist, set selectedSession to null
        if (!state.sessions.length) {
          state.selectedSession = null;
          state.selectedFingerprint = {};
          return
        }

        // If user disconnects the currently selected session, select the next available one
        if (state.sessions.length && state.selectedSession && disconnectedTopic === state.selectedSession.topic) {
          state.selectedSession = state.sessions[state.sessions.length-1];
        }

      })
  },
});

export const { selectSession, setSelectedFingerprint, setPairingUri } = walletConnectSlice.actions;

export default walletConnectSlice.reducer;
