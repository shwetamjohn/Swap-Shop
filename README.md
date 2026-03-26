# SwapShop: Community Exchange & Project Continuity Platform

SwapShop is a full-stack community-driven platform designed to foster local collaboration, reduce waste, and ensure project continuity. It combines project handoffs, real-time food sharing, and item swapping into a single, cohesive ecosystem.

## Key Features

### 1. Relay Board (Project Continuity)
*   **Continuity Protocol:** List unfinished projects, research, or creative works that need a successor.
*   **Digital Handoffs:** Request to take over a project. Owners can review requests and generate a **Digital Handoff Contract** to transfer ownership.
*   **Project Types:** Categorize projects as *Durable*, *Temporary*, or *Urgent*.

### 2. Proximity Pulse (Food Sharing)
*   **Geospatial Mapping:** Interactive map (Leaflet.js) showing nearby food listings.
*   **Atomic "Dibs":** Secure claiming system to prevent multiple users from claiming the same item simultaneously.
*   **Auto-Expiry:** Listings automatically expire after 24 hours via MongoDB TTL indexes to ensure freshness.

### 3. Swap Exchange (Item Trading)
*   **Direct Trade:** List items for trade and browse community offerings.
*   **Request System:** Send and manage swap requests with real-time status updates (Pending, Accepted, Rejected).

### 4. Command Center (User Dashboard)
*   **Impact Metrics:** Track your Trust Score, Global Impact, and Local Impact.
*   **Activity Feed:** Real-time overview of your active projects, food posts, and swap requests.

### 5. Moderation Hub (Admin Panel)
*   **Role-Based Access:** Dedicated dashboard for platform administrators.
*   **User Management:** Ban/Delete users and perform cascading deletions of their associated data.
*   **Content Oversight:** Delete any project, food listing, or swap request to maintain community standards.
*   **Platform Stats:** Real-time overview of total users, projects, and successful exchanges.

---

## Technical Stack

*   **Frontend:** React.js, Tailwind CSS, Framer Motion (Animations), Leaflet.js (Maps), Lucide React (Icons).
*   **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT (Authentication).
*   **Development:** Vite, TypeScript, tsx.

---

## Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **MongoDB** (Atlas cluster or local instance)
*   **Environment Variables:** Create a `.env` file in the root directory with the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_jwt_secret
    PORT=3000
    ```

---

## Installation & Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Seed the Database (Optional):**
    Populate the database with sample users, projects, and items for testing.
    ```bash
    npx tsx seed.ts
    ```

3.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

---

## Security & Admin Rules

### Admin Setup
For security, admin roles cannot be assigned via the UI or API. To grant yourself admin access, run this command in your MongoDB shell or Atlas console after registering:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Security Protocols
*   **No Role Modification:** No API endpoint allows changing the `role` field.
*   **Protected Routes:** All admin endpoints require a valid JWT with `role: "admin"`.
*   **Password Safety:** User passwords are hashed using `bcryptjs` and are never returned by any API endpoint.
*   **Action Logging:** Every admin deletion is logged to the server console with a timestamp and the administrator's email.

---

## API Endpoints

### Auth
*   `POST /api/auth/register` - Create a new account
*   `POST /api/auth/login` - Authenticate and receive JWT
*   `GET /api/auth/profile` - Get current user profile (Protected)

### Projects
*   `GET /api/projects` - List all projects
*   `POST /api/projects` - Create a new project (Protected)
*   `POST /api/projects/:id/handoff` - Request project handoff (Protected)

### Food
*   `GET /api/food` - List nearby active food posts
*   `POST /api/food` - Create a food listing (Protected)
*   `POST /api/food/:id/dibs` - Claim a food item (Protected)

### Admin
*   `GET /api/admin/dashboard` - Platform statistics
*   `GET /api/admin/users` - List all users
*   `DELETE /api/admin/users/:id` - Ban user and delete all their data
