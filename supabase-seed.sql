-- ============================================================
-- BIOME LEAD TRACKING — Seed Data (Nicole's 30 existing leads)
-- Run this AFTER supabase-schema.sql
-- ============================================================

insert into leads (org_name, contact_name, contact_title, contact_initials, stage, priority, ticket_size, next_follow_up, last_contact, type, tags, region, category, comments, action) values

('Impact Seed (Connector)', 'Jasmine', '', 'JA', 'Engaged', 'High', '', '', '', 'philanthropy', ARRAY['Family Office'], 'Australia', 'Philanthropy',
'They have a fund and family offices want it deployed into 1st nations projects. Now raising 2nd $10M fund. Could be impactful.',
'Package something tailored to them, board advisor + equity investment + philanthropy'),

('Spinifex Foundation', 'Sophie Chamberlain', '', 'SC', 'Engaged', 'High', '', '', '', 'philanthropy', ARRAY['Direct Outreach'], 'Australia', 'Philanthropy',
'Highly engaged. Notes a lack of aligned vehicles for their corpus. Believes if she invests, her network will follow (FOMO)',
'Give her a few more days to consult siblings post-holidays, then follow up.'),

('Lotterywest', 'Lorna Pritchard', '', 'LP', 'Contacted', 'Medium', '', '', '', 'philanthropy', ARRAY['Shared Lead'], 'Australia', 'Philanthropy',
'Clarified they can only invest in the philanthropic fund (Fund 1), not the commercial/equity fund.',
'Ollie drafting a scoping/operational document outlining structure and partnership model to send this week.'),

('WWF', 'Monica Richter', '', 'MR', 'Engaged', 'Critical', '', '', '', 'philanthropy', ARRAY['Direct Outreach'], 'Australia', 'Philanthropy',
'Bit immediately on industrial decarb angle. Releasing a white paper soon. Massive brand-halo opportunity for Biome.',
'Follow-up call on Monday to push broader partnership conversation and propose an online workshop.'),

('Bennett Family Office', 'Stuart Anste / Paul Bennett / Todd', '', 'SA', 'New', 'Medium', '', '', '', 'philanthropy', ARRAY['Warm Intro'], 'Australia', 'Philanthropy',
'Initial walls hit, but new entry points identified. Paul Bennett is the target for nature; Todd is looking for a full-time role.',
'Ollie to contact Stuart Anste (Lead, Nature Positive). Nicole to leverage personal connection for an off-the-record chat.'),

('Sydney HNWI Network', 'Nicole''s Contact', '', 'NC', 'Awaiting Response', 'Medium', '', '', '', 'philanthropy', ARRAY['Warm Intro'], 'Australia', 'Philanthropy',
'Contact is currently hunting through the pack to identify quiet HNWIs in Sydney passionate about nature.',
'Await names/introductions from contact.'),

('AEGN', 'Claire O''Rourke', '', 'CO', 'Contacted', 'Medium', '', '', '', 'philanthropy', ARRAY['Cold Outreach'], 'Australia', 'Philanthropy',
'Australian Environmental Grantmakers Network. Outreach sent.',
'Nicole to follow up if no response is received in the coming days.'),

('Minderoo', 'Kirsten Stevenson', '', 'KS', 'New', 'Medium', '', '', '', 'philanthropy', ARRAY['Direct Outreach'], 'Australia', 'Philanthropy', '', ''),

('Clough Group / Oceans Institute', 'Jock Clough', '', 'JC', 'Parked', 'Low', '', '', '', 'philanthropy', ARRAY['Direct Outreach'], 'Australia', 'Philanthropy',
'Met with Nicole. Active in marine (recently deployed $3M) but prefers direct project investment over funds.',
'PARKED (for now): Re-engage once we have a specific, packaged marine project (kelp, mangroves, coral).'),

('HNWI', 'Alex Burt', '', 'AB', 'New', 'Medium', '', '', '', 'philanthropy', ARRAY['Warm Intro'], 'Australia', 'Philanthropy',
'Need to think of strategy as cold outreach',
'Talking to Peter Klinken about intro; Peter will reconnect on the WA+ focus and then Nicole can pick up the Biome opportunity.'),

('HNWI', 'Leonie Baldock', '', 'LB', 'Contacted', 'Medium', '', '', '', 'philanthropy', ARRAY['Cold Outreach'], 'Australia', 'Philanthropy',
'Need to think of strategy as cold outreach',
'Nicole emailed Leonie on 11/11 with request to meet'),

('Murdoch University', 'Professor Andrew Deeks', '', 'PD', 'Contacted', 'Medium', '', '', '', 'philanthropy', ARRAY['Shared Lead'], 'Australia', 'Philanthropy',
'Nic knows but do they have funds?',
'Nicole emailed Andrew on 11/11 with request for meeting'),

('Paul Ramsay Foundation', 'Alex Martin', '', 'AM', 'Closed', 'Low', '', '', '', 'philanthropy', ARRAY['Direct Outreach'], 'Australia', 'Philanthropy',
'We have decided this is not for us. The scope of the fund is outside the remit of our concessional funding.',
'Nicole emailed 13/11 with request for a meeting. Model considered by Alex Burt and they have passed as it does not directly align.'),

('Stan Perron Charitable Trust', 'TBC', '', '??', 'New', 'Low', '', '', '', 'philanthropy', ARRAY['Direct Outreach'], 'Australia', 'Philanthropy',
'Nic to do some digging',
'Only interested in health projects'),

('Clough Engineering', 'Jock Clough (Sam)', '', 'JC', 'New', 'Low', '', '', '', 'philanthropy', ARRAY['Foundation'], 'Australia', 'Philanthropy',
'I''ve had the opportunity to review everything with Jock, and unfortunately it falls outside the scope of what the Jock Clough Foundation supports.',
'Had call, 25th Nov, only interested in Marine, 100% rates Luke, asked luke for shark bay opp and one other, could be good.'),

('H-U', 'Adrian Fini', '', 'AF', 'Contacted', 'Medium', '', '', '', 'philanthropy', ARRAY['Direct Outreach'], 'Australia', 'Philanthropy',
'Michelle: Due to our current commitments we don''t have the bandwidth to invest or get involved however we''ll definitely keep an eye on things.',
'Nicole emailed Adrian on 11/11 with request for meeting; Adrian currently overseas and will be in touch to make a time when back.'),

('Poynton Partners', 'John Poynton', '', 'JP', 'Contacted', 'Medium', '', '', '', 'philanthropy', ARRAY['Direct Outreach'], 'Australia', 'Philanthropy',
'Nic follow-up chat',
'Nicole emailed John on 11/11 with request for meeting; he is considering the proposal and will be in touch soon to discuss.'),

('The Feilman Foundation', 'Jan Stewart', '', 'JS', 'Contacted', 'Medium', '', '', '', 'philanthropy', ARRAY['Warm Intro'], 'Australia', 'Philanthropy',
'Nicole to investigate',
'Nicole emailed Jan on 11/11 to request meeting - preliminary feedback from Jan that a contribution from Feilman is possible.'),

('Impact Seed', 'TBC', '', '??', 'Contacted', 'Medium', '', '', '', 'investor', ARRAY['Shared Lead'], 'Australia', 'Investors',
'Great alignment on many fronts',
'Waiting on follow-up to go into more detail on their follow-on contacts'),

('WA Treasury Corporation', 'Kaylean', '', 'KA', 'Proposal Sent', 'Medium', 'A$TBC', '', '', 'investor', ARRAY['Government'], 'Australia', 'Investors',
'Invests on behalf of the state. Nicole pitched them on Biome being set up for institutional investment.',
'Wants to know more about Biome 3.0, briefing offered'),

('WA State Government', 'James Yuen', '', 'JY', 'New', 'Critical', 'A$~$5M+', '', '', 'investor', ARRAY['Government'], 'Australia', 'Investors',
'Precedent exists for state backing new VC funds (e.g., $200k for ManCo fees + $5M into the fund).',
'Nicole to refine the pitch and approach the relevant department for similar venture/innovation backing.'),

('Aware Super', 'Tim Channerand', '', 'TC', 'New', 'Medium', '', '', '', 'investor', ARRAY['Direct Outreach'], 'Australia', 'Investors',
'',
'Nic to check'),

('Curtin Angel Syndicate', 'Larry Lopez', '', 'LL', 'Contacted', 'Medium', '', '', '', 'investor', ARRAY['Direct Outreach'], 'Australia', 'Investors',
'',
'Had said yes but never confirmed date, will chase'),

('Perth Angels', 'Wilson', '', 'WI', 'Engaged', 'High', '', '', '', 'investor', ARRAY['Warm Intro'], 'Australia', 'Investors',
'Keen to talk and intro us to VDK (below)',
'Will let us know feedback'),

('VDK Ventures', 'TBC', '', '??', 'New', 'Medium', '', '', '', 'investor', ARRAY['Warm Intro'], 'Australia', 'Investors',
'Intro from Perth Ventures',
''),

('Clean Energy Finance Corporation', 'Heech Sul (Malcolm Thornton?)', '', 'HT', 'New', 'Medium', '', '', '', 'investor', ARRAY['Direct Outreach'], 'Australia', 'Investors',
'They have a head of natural capital division, Nic meeting',
''),

('Deloitte', 'Matt Judkins', '', 'MJ', 'Meeting Set', 'Critical', 'TBC', '', '', 'investor', ARRAY['Shared Lead'], 'Australia', 'Investors',
'Have already set up their own ACCU projects. Strong potential as a cornerstone commercial investor or ManCo equity partner.',
'In-person meeting scheduled for the 4th, Glen too; Nicole to loop back with Matt Judkins afterward.'),

('Rio Tinto', 'Sarah, Amy, Declan, Jonty', '', 'SA', 'New', 'Medium', 'TBC', '', '', 'investor', ARRAY['Warm Intro'], 'Australia', 'Investors',
'Nicole ran into Sarah and Amy at a dinner. Tamron advised re-engaging in the New Year.',
'Nicole to ask Rohan for a warm re-intro for coffee with Sarah/Amy. Lorenzo to continue warming up Declan/Jonty.'),

('Woodside', 'Julie Fallon / Ben Wyatt', '', 'JF', 'New', 'Medium', 'TBC', '', '', 'investor', ARRAY['Shared Lead'], 'Australia', 'Investors',
'Need a top-down and bottom-up approach.',
'Nicole to piggyback on her husband''s meeting with Julie Fallon. Glen to try Ben Wyatt again.'),

('BHP, Alcoa, Wesfarmers', 'Luke Bailey / Owen (Connectors)', '', 'LB', 'Parked', 'Medium', 'TBC', '', '', 'investor', ARRAY['Shared Lead'], 'Australia', 'Investors',
'Luke and Owen have deep industry relationships with the major miners.',
'Hold a call with Luke/Owen to formally ask them to open doors, potentially tied to formalizing their advisory roles.');

-- ── Seed interactions ────────────────────────────────────────
insert into interactions (lead_id, date, type, summary, outcome, follow_up_date) values
(2, '2025-03-15', 'Call', 'Sophie consulting siblings post-holidays, very engaged', 'Awaiting Response', '2025-03-22'),
(4, '2025-03-10', 'Call', 'Partnership conversation - industrial decarb angle resonated strongly', 'Follow-up Required', '2025-03-17'),
(27, '2025-03-04', 'Meeting', 'In-person meeting with Matt Judkins, Glen attended', 'Positive', '2025-03-11'),
(28, '2025-02-28', 'Email', 'Nicole ran into Sarah and Amy at dinner, re-engaging in New Year', 'Warm Lead', '2025-03-10'),
(8, '2025-03-01', 'Email', 'Follow-up with Minderoo, Kirsten Stevenson', 'Pending', '2025-03-15'),
(16, '2024-12-09', 'Meeting', 'Meeting with Adrian Fini at H-U offices', 'Interested but no bandwidth currently', '2025-01-15');
