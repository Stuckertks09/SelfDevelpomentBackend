# Self-Development Chatbot (Backend)

This is the backend system for a GPT-powered self-development app designed to help users think through complex emotions, decisions, and mental roadblocks. The app acts as a conversational mirror — not a coach, not a therapist — but a deeper, honest part of the user.

### 🧠 Core Idea

This app allows users to talk to themselves through a chatbot interface, powered by GPT. The goal is to create a space for reflection, pattern recognition, and subtle reframing — in real time.

The chatbot isn't generic. It uses custom system prompts and adapts tone based on input. It starts in a raw, emotionally attuned voice and shifts into a more grounded, reflective state ("edge") as conversations evolve.

---

### 🔧 Current Stage

- 🔄 Switching between **"raw"** and **"edge"** personality modes based on user input
- ✅ Session-based chat with support for **anonymous guest users**
- ✅ Authenticated user flow with **guest-to-user conversion**
- ✅ API routes for message handling, user/session management
- ✅ React Native frontend integration in progress

---

### 📦 Key Features

- **Session Management**
  - Guests can chat without logging in
  - Sessions are created and tracked via backend tokens
  - Authenticated users retrieve past sessions

- **Message Storage**
  - Messages are saved and associated with sessions
  - Support for both anonymous and authenticated users
  - Plaintext for now (encryption planned)

- **Personality State Engine**
  - System prompt starts in “raw” emotional mode
  - Shifts to “edge” based on tone or message triggers
  - Each message evaluated for transition logic

- **Auth Flow**
  - Users can create an account mid-chat (guest→user)
  - Auth via simple email/password
  - Token stored via frontend (AsyncStorage for React Native)

---

### 🧪 Tech Stack

- **Backend:** Node.js (ES Modules)
- **API:** RESTful routes for messages, sessions, users
- **Database:** MongoDB (message/session/user schema)
- **Auth:** JWT tokens
- **Frontend:** React Native (mobile-first)

---

### 🔍 Future Plans

- Full encryption of stored messages
- Timeline view / logbook of past insights
- Pattern recognition engine
- "Modes of use" (daily journaling, breakthrough mode, etc.)
- Voice journaling support
- Customizable tone and prompt settings

---

### 🤝 Why This Exists

This isn’t a productivity app. It’s not therapy. It’s built for people who want to get unstuck, make decisions, or just feel seen by their own words. It’s part journaling, part insight engine — and entirely private.

---

### ⚠️ Notes

- This is an early-stage build. The core logic is functional, but UI polish, error handling, and edge-case coverage are still in progress.
- GPT responses are handled server-side for better control and token management.
- Session and personality state logic is evolving rapidly — feedback welcome.

---

