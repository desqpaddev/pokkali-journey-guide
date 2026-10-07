# Tour Agent Module

Agents can sell tour packages at their own price (base + markup). The admin approves agents, their markups, and every agent booking.

## How it works

```text
Agent applies -> Admin approves agent -> Agent sets markup per package
  -> Admin approves markup -> Agent sells (books directly OR shares link)
  -> Booking = "pending approval" -> Admin confirms -> Customer gets confirmation email
```

## Agent side
- **Become an agent** page (`/agent/apply`): agency name, phone, GST no. (optional), address. A signed-in user submits and waits for approval.
- **Agent dashboard** (`/agent`), only for approved agents:
  - **My prices**: list of active packages with base price. For each one the agent picks a fixed ₹ per guest or a % markup. It shows the selling price and its status (pending / approved / rejected, plus the admin's note).
  - **Book for customer**: pick a package with an approved markup, then enter date, guests, customer name, phone and email. The total uses the agent's price. The booking goes in as "Pending approval".
  - **Share links**: copy a personal link per package (`/packages/<slug>?agent=CODE`).
  - **My sales**: bookings list with status, base amount, markup earned and totals, with a date filter and CSV export.

## Customer via shared link
- The package page reads `?agent=CODE` (also remembered for the visit). If that agent and markup are approved, it shows the agent's price and "Booked via <Agency>".
- The booking is saved with the agent attached and status "Pending approval". Customers still need to sign in. Agent-link bookings skip the usual customer-approval check, because the admin approves each one anyway.

## Admin side (new "Agents" tab in the Control Room)
- **Applications**: approve or reject agents, and suspend them later.
- **Markups**: queue of pending markup requests. Approve or reject each with a note.
- **Agent bookings**: pending agent bookings. Confirm (sends the confirmation email) or reject.
- **Agent report**: sales per agent for a date range (bookings, guests, base revenue, markup, total) with CSV. This is a report only and is not added to PSCB settlements.
- The existing Bookings tab shows an "Agent" column.

## Technical details
- Migration:
  - `agents` (id, user_id unique, code unique, agency_name, phone, gst_no, address, status pending/approved/rejected/suspended, approved_by/at, created_at).
  - `agent_markups` (agent_id, package_id, markup_type fixed|percent, markup_value, status pending/approved/rejected, admin_note, reviewed_by/at; unique agent+package). Any edit sets the status back to pending.
  - `bookings` gets nullable columns `agent_id`, `base_amount`, `markup_amount`, `booked_by_agent bool default false`. New agent bookings use status `pending_approval`.
- GRANTs and RLS on each table: an agent reads and writes its own rows. Agents cannot write status or approval columns; a trigger forces `pending` on insert or update unless the user is an admin. Admins get full access.
- A public, security-definer RPC `get_agent_price(code, package_id)` returns the agency name and price only when both the agent and the markup are approved. The price is calculated on the server.
- Agent booking inserts go through a server function (`requireSupabaseAuth`). It recalculates the total from the approved markup so the client can't tamper with prices, sets `pending_approval`, and inserts with the admin client after checks.
- Admin confirmation updates the status to `confirmed` and sends the existing booking-confirmation email.
- Routes: `agent.apply.tsx` (under `_authenticated`), `_authenticated/agent/index.tsx`, `_authenticated/admin/agents.tsx`. Add nav links: "Agent" in the header menu for agents and "Become an agent" in the footer.
- Record the agent-module rules in AGENTS.md and update FEATURES.md.
