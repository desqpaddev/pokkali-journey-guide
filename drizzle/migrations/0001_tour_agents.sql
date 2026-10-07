CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  code text NOT NULL UNIQUE DEFAULT upper(substr(md5(random()::text),1,6)),
  agency_name text NOT NULL,
  phone text,
  gst_no text,
  address text,
  status text NOT NULL DEFAULT 'pending',
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agents TO authenticated;
GRANT ALL ON public.agents TO service_role;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY agents_self_read ON public.agents FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY agents_self_insert ON public.agents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY agents_self_update ON public.agents FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY agents_admin_delete ON public.agents FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.agent_markups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  markup_type text NOT NULL DEFAULT 'fixed',
  markup_value numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (agent_id, package_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_markups TO authenticated;
GRANT ALL ON public.agent_markups TO service_role;
ALTER TABLE public.agent_markups ENABLE ROW LEVEL SECURITY;
CREATE POLICY markups_rw ON public.agent_markups FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_id AND a.user_id = auth.uid()))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_id AND a.user_id = auth.uid() AND a.status='approved'));

CREATE OR REPLACE FUNCTION public.agents_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(),'admin') OR auth.role() = 'service_role' THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending'; NEW.approved_by := NULL; NEW.approved_at := NULL;
  ELSE
    NEW.status := OLD.status; NEW.approved_by := OLD.approved_by; NEW.approved_at := OLD.approved_at;
    NEW.code := OLD.code; NEW.user_id := OLD.user_id;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER agents_guard_trg BEFORE INSERT OR UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.agents_guard();

CREATE OR REPLACE FUNCTION public.markups_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(),'admin') OR auth.role() = 'service_role' THEN RETURN NEW; END IF;
  NEW.status := 'pending'; NEW.reviewed_by := NULL; NEW.reviewed_at := NULL; NEW.admin_note := NULL;
  RETURN NEW;
END $$;
CREATE TRIGGER markups_guard_trg BEFORE INSERT OR UPDATE ON public.agent_markups FOR EACH ROW EXECUTE FUNCTION public.markups_guard();

ALTER TABLE public.bookings
  ADD COLUMN agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  ADD COLUMN base_amount numeric,
  ADD COLUMN markup_amount numeric,
  ADD COLUMN booked_by_agent boolean NOT NULL DEFAULT false;

CREATE POLICY bookings_agent_read ON public.bookings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_id AND a.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.get_agent_price(_code text, _package_id uuid)
RETURNS TABLE(agent_id uuid, agency_name text, base_price numeric, price_per_person numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT a.id, a.agency_name, p.price_per_person,
    CASE WHEN m.markup_type = 'percent' THEN round(p.price_per_person * (1 + m.markup_value/100), 2)
         ELSE p.price_per_person + m.markup_value END
  FROM public.agents a
  JOIN public.agent_markups m ON m.agent_id = a.id AND m.package_id = _package_id AND m.status = 'approved'
  JOIN public.packages p ON p.id = _package_id
  WHERE upper(a.code) = upper(_code) AND a.status = 'approved'
$$;
GRANT EXECUTE ON FUNCTION public.get_agent_price(text, uuid) TO anon, authenticated;