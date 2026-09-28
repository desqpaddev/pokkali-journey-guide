CREATE TABLE public.acc_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  gst_percent numeric NOT NULL DEFAULT 5,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.acc_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE public.acc_stakeholders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'service_provider',
  bank_account text,
  ifsc text,
  contact text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.acc_share_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity text NOT NULL DEFAULT 'farm_tour',
  stakeholder_id uuid NOT NULL REFERENCES public.acc_stakeholders(id) ON DELETE CASCADE,
  percent numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.acc_settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stakeholder_id uuid NOT NULL REFERENCES public.acc_stakeholders(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  amount_earned numeric NOT NULL DEFAULT 0,
  adjustments numeric NOT NULL DEFAULT 0,
  amount_payable numeric NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  reconciled_by uuid, reconciled_at timestamptz,
  approved_by uuid, approved_at timestamptz,
  paid_at date, payment_reference text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.acc_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_email text,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.acc_settings, public.acc_stakeholders, public.acc_share_rules, public.acc_settlements TO authenticated;
GRANT SELECT, INSERT ON public.acc_audit_log TO authenticated;
GRANT ALL ON public.acc_settings, public.acc_stakeholders, public.acc_share_rules, public.acc_settlements, public.acc_audit_log TO service_role;

ALTER TABLE public.acc_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acc_stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acc_share_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acc_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acc_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY acc_settings_admin ON public.acc_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY acc_stakeholders_admin ON public.acc_stakeholders FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY acc_rules_admin ON public.acc_share_rules FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY acc_settlements_admin ON public.acc_settlements FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY acc_audit_read ON public.acc_audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY acc_audit_insert ON public.acc_audit_log FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') AND user_id = auth.uid());