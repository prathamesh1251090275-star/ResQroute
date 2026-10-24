# ResQRoute — Smart Food Rescue & Last-Mile Aid Coordination Platform

> **"Rescue Food. Deliver Hope."**  
> An AI-driven, multi-constraint last-mile logistics and emergency diversion grid designed to eliminate preventable food spoilage and delivery failure.

---

## 🌟 Executive Summary

Surplus food from restaurants, banquet halls, student messes, and corporate kitchens is often lost because coordination breaks down under real-world constraints:
1. **Perishable food expires in transit** before reaching shelters due to temperature danger zone exposure.
2. **Donation volumes exceed lone volunteer capacities** (e.g. a 180-meal banquet excess vs. a 40-capacity bike).
3. **Ghost volunteer drop-offs**: volunteers claim deliveries but fail to confirm, leaving hot food stranded.
4. **Mid-route facility shutdowns**: destination shelters suffer power outages or reach full capacity while food is en route.
5. **Facility mismatches**: chilled dairy sent to camps without electricity or cold storage spoils on site.

**ResQRoute** solves this through six interconnected algorithmic engines that enforce food safety thresholds, partition large batches across available fleets, prevent ghost reservations, and automatically reroute shipments mid-transit.

---

## 🚀 Key Innovations

### Innovation 1: Smart Shelf-Life Eligibility Engine
- Evaluates food metadata (category, preparation timestamp, holding temperature, and packaging seal).
- Applies transparent microbial holding guidelines (e.g. ambient danger zone 5°C - 60°C capped at 4 hours; hot-holding at >60°C permitted up to 4.5 hours; chilled chain <4°C up to 24 hours).
- Yields three clear statuses: **Eligible for Matching**, **Review Required** (for missing metadata), or **Blocked**.
- *Honest Scientific Principle*: We never claim food is safe based on image guesswork or arbitrary AI predictions. Declarations must be physically verified upon courier arrival.

### Innovation 2: Multi-Rider Smart Splitting
- Detects when donation batch volume ($Q$) exceeds individual rider cargo limits ($C_i$).
- Queries nearby available riders sorted by reliability score and capacity.
- Partitions the load dynamically (e.g. 180 meals split into $40 + 40 + 40 + 40 + 20$) ensuring no volunteer is overloaded.

### Innovation 3: Ghost Reservation Prevention Guard
- Assigns a configurable confirmation countdown (e.g. 60 seconds in demo mode) upon task dispatch.
- If a volunteer fails to acknowledge the dispatch in time, the system revokes the reservation and reallocates the shipment to the next best backup rider.

### Innovation 4: Mid-Route Rescue & Dynamic Diversion Engine
- If a destination shelter suffers a sudden outage (e.g., cooling compressor failure or intake saturation) while a courier is already en route:
- The engine calculates reroute candidates based on remaining shelf-life buffer, facility compatibility, and open demand, redirecting the courier with zero food wasted.

### Innovation 5: Destination Facility Compatibility Engine
- Matches food preservation requirements against verified destination amenities:
  - *Clean Potable Water* (required for raw grains / pulses)
  - *Active Cooking Fuel* (required for uncooked ingredients)
  - *Refrigeration / 4°C Cold Storage* (required for chilled dairy / cooked chilled meals)
  - *Dietary Preferences* (strictly enforces 100% vegetarian shelters)

### Innovation 6: Explainable Multi-Criteria Smart Matching
- Ranks candidates through transparent scoring: Proximity (35 pts), Demand Urgency (35 pts), Delivery Deadline Feasibility Buffer (20 pts), and Facility Completeness (10 pts).
- Displays clear explanations for recommendations and transparent reasons for rejected candidates.

---

## 🧭 Role-Based Dashboards

| View | Purpose |
|---|---|
| **🌐 Public Landing** | Problem vs Solution overview, live operations ticker, impact metrics, and 3-step workflow. |
| **⚡ Admin Operations** | Geospatial Leaflet map, live in-transit monitoring, dispatch controls, capacity analytics, and system activity stream. |
| **🍲 Donor Hub** | 1-click surplus presets (Banquet, Bakery, Student Mess), live shelf-life preview, and instant shareable Impact Certificates. |
| **🚴 Volunteer Rider** | Task dispatch notifications, ghost timeout countdown, simulated GPS movement steps, and route handover controls. |
| **🏠 Shelter Intake** | Real-time intake logging, facility compliance declarations, and SOS demand surge buttons. |
| **📜 Audit & History** | Searchable chronological log of all safety checks, split allocations, reroutes, and one-click `.CSV` export. |
| **🧪 Judge Simulation Lab** | Interactive test center featuring 7 one-click stress-test scenarios for hackathon evaluators. |

---

## 🧪 Judge Simulation Lab — 7 Interactive Scenarios

Judges can test edge cases in real-time under the **Judge Lab** tab:

1. **Scenario 1: Multi-Rider Splitting** — Partitions 180 meals across 5 available riders without capacity overflow.
2. **Scenario 2: Ghost Reservation Timeout** — Unresponsive rider assignment automatically expires and reallocates to a backup courier.
3. **Scenario 3: Mid-Route Shelter Closure** — Destination shelter loses power mid-transit; delivery DEL-8801 is safely rerouted to an alternative shelter.
4. **Scenario 4: Urgent Food Deadline** — Short shelf-life food (30m buffer) triggers expedited ultra-local routing.
5. **Scenario 5: Incompatible Facility Block** — Chilled dairy is blocked from being dispatched to a camp without refrigeration.
6. **Scenario 6: Rider Vehicle Breakdown** — In-transit courier breakdown triggers nearby roadside cargo transfer.
7. **Scenario 7: Incomplete Metadata Review** — Missing preparation timestamps flag "Review Required" instead of unsafe blind delivery.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, React-Leaflet & OpenStreetMap, Canvas-Confetti, Web Audio API Synthesizer.
- **Backend (Python)**: FastAPI, Uvicorn, Pydantic, REST API endpoints.
- **State & Data**: Reactive local state store with persistent LocalStorage sync, deterministic offline mode, and full audit logging.

---

## ⚡ Quickstart Guide

### 1. Run the Frontend (React + Vite)
```bash
# Navigate to the project root
cd bugslayersVibethon

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run the Backend (Python FastAPI) *(Optional)*
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
API Documentation (Swagger UI) is available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🔒 Security & Data Integrity

- **Input Validation**: Hard bounds on quantities, coordinates, and timestamp entries.
- **Audit Lineage**: All critical state transitions (allocations, splits, cancellations, and diversions) append immutable audit logs with timestamps and actor IDs.
- **Privacy First**: Sensitive contact details and raw rider device telemetry are masked and simulated for demonstration safety.
- **Data Reset**: Click **"Reset Demo"** in the top navigation bar at any time to restore the initial test scenario.

---

*Built with passion by Team BugSlayers for the Hackathon.*
# ResQroute
