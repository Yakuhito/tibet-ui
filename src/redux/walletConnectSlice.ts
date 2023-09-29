import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { SessionTypes } from "@walletconnect/types";

export interface WalletConnectState {
  sessions: SessionTypes.Struct[] | [];
  selectedSession: SessionTypes.Struct | null | void;
  selectedFingerprint: {
    [topic: string]: number;
  }
  pairingUri: string | null;
}

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
    connectSession(state, action: PayloadAction<SessionTypes.Struct | null>) {
      const newSession = action.payload;
      // Set the active session as the newly connected one
      if (newSession) {
        state.selectedSession = newSession;
        state.selectedFingerprint[newSession.topic] = Number(newSession.namespaces.chia.accounts[0].split(":")[2]);
      }
    },

    setSessions(state, action: PayloadAction<SessionTypes.Struct[] | []>) {
      const sessions = action.payload;
      state.sessions = sessions;
    },

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

    deleteTopicFromFingerprintMemory(state, action: PayloadAction<string>) {
      const topic = action.payload;
      if (topic in state.selectedFingerprint) {
        delete state.selectedFingerprint[topic];
      }

      // If no more sessions exist, set selectedSession to null
      if (!state.sessions.length) {
        state.selectedSession = null;
        state.selectedFingerprint = {};
        return
      }

      // If user disconnects the currently selected session, select the next available one
      if (state.sessions.length && state.selectedSession && topic === state.selectedSession.topic) {
        state.selectedSession = state.sessions[state.sessions.length-1];
      }
    },

    setPairingUri(state, action: PayloadAction<string | null>) {
      const uri = action.payload;
      state.pairingUri = uri;
    },
  }
});

export const { connectSession, setSessions, selectSession, setSelectedFingerprint, setPairingUri, deleteTopicFromFingerprintMemory } = walletConnectSlice.actions;

export default walletConnectSlice.reducer;
