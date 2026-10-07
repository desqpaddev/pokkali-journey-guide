<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Tour agents
- Agent prices are always computed server-side (`get_agent_price` RPC + `createAgentBooking` server fn); never trust client totals. Why: prevents price tampering.
- Agent/markup approval fields are protected by DB triggers that reset them unless the caller is admin. Why: agents can edit their own rows safely.
- Agent bookings start as `pending_approval` and only admins confirm them. Why: business rule requires admin approval of each agent sale.
