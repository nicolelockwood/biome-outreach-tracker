// Biome Outreach Tracker — Daily Summary Email
// Deploy to: Supabase → Edge Functions → New Function → paste this code
// Schedule:  Supabase → Edge Functions → daily-summary → Schedule → "0 7 * * *" (7am AEST = 21:00 UTC)
// Env vars needed (set in Supabase → Settings → Edge Functions → Secrets):
//   SUPABASE_URL          — your project URL (already set automatically)
//   SUPABASE_SERVICE_KEY  — your service role key (Settings → API → service_role)
//   RESEND_API_KEY        — get free key at resend.com
//   RECIPIENT_EMAIL       — nicole@lockwoodadvisory.com.au (or whatever Nicole's email is)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_KEY')!
);

function parseTicket(str: string | null): number {
  if (!str) return 0;
  let s = str.replace(/[$,\s]/g, '');
  if (/B$/i.test(s)) return parseFloat(s) * 1_000_000_000;
  if (/M$/i.test(s)) return parseFloat(s) * 1_000_000;
  if (/K$/i.test(s)) return parseFloat(s) * 1_000;
  return parseFloat(s) || 0;
}

function fmtM(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'K';
  return n > 0 ? '$' + n.toLocaleString() : '$0';
}

Deno.serve(async (_req) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    const dateLabel = today.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // ── Fetch all leads ───────────────────────────────────────────────
    const { data: leads = [] } = await supabase.from('leads').select('*').order('id');

    // ── Fetch follow-ups due today or overdue ─────────────────────────
    const { data: followUps = [] } = await supabase
      .from('interactions')
      .select('*, leads(org_name, priority)')
      .not('follow_up_date', 'is', null)
      .eq('completed', false)
      .lte('follow_up_date', todayStr)
      .order('follow_up_date', { ascending: true });

    const overdue = followUps.filter((f: any) => f.follow_up_date < todayStr);
    const dueToday = followUps.filter((f: any) => f.follow_up_date === todayStr);

    // ── Pipeline stats ────────────────────────────────────────────────
    const stageCounts: Record<string, number> = {};
    for (const l of leads) {
      stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1;
    }

    const secured = leads.filter((l: any) => l.stage === 'Secured');
    const totalLanded = secured.reduce((s: number, l: any) => s + parseTicket(l.ticket_size), 0);
    const philLanded  = secured.filter((l: any) => (l.category||'').includes('Philanthropy')).reduce((s: number, l: any) => s + parseTicket(l.ticket_size), 0);
    const invLanded   = secured.filter((l: any) => (l.category||'').includes('Investors')).reduce((s: number, l: any) => s + parseTicket(l.ticket_size), 0);

    const highPriority = leads.filter((l: any) => (l.priority === 'High' || l.priority === 'Critical') && l.stage !== 'Parked' && l.stage !== 'Secured');

    // ── Build HTML email ──────────────────────────────────────────────
    const followUpRow = (f: any) => {
      const isOverdue = f.follow_up_date < todayStr;
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eef2ef;">
            <span style="font-weight:700;color:#1a3d2b;">${f.leads?.org_name || 'Unknown'}</span>
            <br/><span style="color:#5a7263;font-size:13px;">${f.follow_up_action || f.summary?.slice(0, 60) || '—'}</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #eef2ef;white-space:nowrap;color:${isOverdue ? '#c0392b' : '#1a3d2b'};font-weight:600;font-size:13px;">
            ${isOverdue ? '⚠ ' : ''}${f.follow_up_date}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #eef2ef;">
            <span style="background:${(f.leads?.priority === 'High' || f.leads?.priority === 'Critical') ? '#fdf0ee' : '#e8f5ee'};color:${(f.leads?.priority === 'High' || f.leads?.priority === 'Critical') ? '#c0392b' : '#1a3d2b'};padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;">
              ${f.leads?.priority === 'Critical' ? 'High' : (f.leads?.priority || 'Med')}
            </span>
          </td>
        </tr>`;
    };

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f4ef;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

    <!-- Header -->
    <div style="background:#1a3d2b;padding:32px 36px 28px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="background:#00c566;width:10px;height:10px;border-radius:50%;"></div>
        <span style="color:rgba(255,255,255,0.5);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Earthly Ventures · Biome Tracker</span>
      </div>
      <h1 style="color:#ffffff;margin:0 0 6px;font-size:28px;font-weight:700;">Good morning, Nicole 🌿</h1>
      <p style="color:rgba(255,255,255,0.55);margin:0;font-size:15px;">${dateLabel}</p>
    </div>

    <div style="padding:32px 36px;">

      <!-- Alert if overdue -->
      ${overdue.length > 0 ? `
      <div style="background:#fdf0ee;border:1px solid rgba(192,57,43,0.2);border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;color:#c0392b;font-weight:700;font-size:15px;">⚠ ${overdue.length} overdue follow-up${overdue.length > 1 ? 's' : ''}</p>
        <p style="margin:6px 0 0;color:#a93226;font-size:13px;">These need your attention today.</p>
      </div>` : ''}

      <!-- Follow-ups section -->
      ${followUps.length > 0 ? `
      <h2 style="color:#1a3d2b;font-size:17px;font-weight:700;margin:0 0 14px;">Today's Follow-ups${overdue.length > 0 ? ' + Overdue' : ''}</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;background:#f8faf9;border-radius:12px;overflow:hidden;">
        <thead>
          <tr style="background:#e8f5ee;">
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a7263;">Lead</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a7263;">Due</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a7263;">Priority</th>
          </tr>
        </thead>
        <tbody>
          ${followUps.map(followUpRow).join('')}
        </tbody>
      </table>` : `
      <div style="background:#e8f5ee;border-radius:12px;padding:20px;text-align:center;margin-bottom:32px;">
        <p style="margin:0;color:#1a3d2b;font-weight:700;">✓ You're all caught up — no follow-ups due today!</p>
      </div>`}

      <!-- Goal progress -->
      <h2 style="color:#1a3d2b;font-size:17px;font-weight:700;margin:0 0 14px;">Funding Goals</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
        <tr>
          <td style="padding:0 8px 0 0;width:50%;">
            <div style="background:#f8faf9;border-radius:12px;padding:16px 18px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a7263;">Philanthropy · $5M Goal</p>
              <p style="margin:0;font-size:22px;font-weight:700;color:#1a3d2b;">${fmtM(philLanded)}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#5a7263;">landed · ${Math.round(philLanded/5_000_000*100)}% of goal</p>
            </div>
          </td>
          <td style="padding:0 0 0 8px;width:50%;">
            <div style="background:#f8faf9;border-radius:12px;padding:16px 18px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a7263;">Investment · $100M Goal</p>
              <p style="margin:0;font-size:22px;font-weight:700;color:#1a3d2b;">${fmtM(invLanded)}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#5a7263;">landed · ${Math.round(invLanded/100_000_000*100)}% of goal</p>
            </div>
          </td>
        </tr>
      </table>

      <!-- Pipeline snapshot -->
      <h2 style="color:#1a3d2b;font-size:17px;font-weight:700;margin:0 0 14px;">Pipeline Snapshot</h2>
      <div style="background:#f8faf9;border-radius:12px;padding:16px 18px;margin-bottom:32px;">
        <table style="width:100%;border-collapse:collapse;">
          ${['New','Contacted','Engaged','Meeting Set','Proposal Sent','Awaiting Response','Parked','Secured'].filter(s => stageCounts[s] > 0).map(s => `
          <tr>
            <td style="padding:6px 0;color:#5a7263;font-size:13px;">${s}</td>
            <td style="padding:6px 0;text-align:right;font-weight:700;color:#1a3d2b;font-size:13px;">${stageCounts[s]}</td>
          </tr>`).join('')}
        </table>
      </div>

      <!-- High priority leads -->
      ${highPriority.length > 0 ? `
      <h2 style="color:#1a3d2b;font-size:17px;font-weight:700;margin:0 0 14px;">High Priority Leads</h2>
      <div style="background:#fdf0ee;border-radius:12px;padding:16px 18px;margin-bottom:32px;">
        ${highPriority.slice(0,5).map((l: any) => `
        <div style="padding:6px 0;border-bottom:1px solid rgba(192,57,43,0.1);">
          <span style="font-weight:700;color:#1a3d2b;font-size:13px;">${l.org_name}</span>
          <span style="color:#5a7263;font-size:12px;"> · ${l.stage}</span>
        </div>`).join('')}
      </div>` : ''}

      <!-- CTA -->
      <div style="text-align:center;margin-top:8px;">
        <a href="https://nicolelockwood.github.io/biome-outreach-tracker"
          style="display:inline-block;background:#1a3d2b;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:14px;font-weight:700;font-size:14px;">
          Open Biome Tracker →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8faf9;padding:20px 36px;border-top:1px solid #eef2ef;text-align:center;">
      <p style="margin:0;color:#5a7263;font-size:12px;">Earthly Ventures · Biome Outreach Tracker · Daily Summary</p>
      <p style="margin:6px 0 0;color:#aab5ae;font-size:11px;">This email is sent automatically each morning. Manage your outreach at biome-outreach-tracker.</p>
    </div>
  </div>
</body>
</html>`;

    // ── Send via Resend ───────────────────────────────────────────────
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const recipientEmail = Deno.env.get('RECIPIENT_EMAIL') || 'nicole@lockwoodadvisory.com.au';

    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Biome Outreach <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: `Your Earthly Outreach Summary — ${dateLabel}${followUps.length > 0 ? ` (${followUps.length} follow-up${followUps.length > 1 ? 's' : ''} due)` : ''}`,
        html,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Resend error', detail: result }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, sent_to: recipientEmail, followUps: followUps.length }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
