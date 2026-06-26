
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_by uuid;

-- Allow admins to view & update all profiles
DROP POLICY IF EXISTS "profiles_admin_select" ON public.profiles;
CREATE POLICY "profiles_admin_select" ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;
CREATE POLICY "profiles_admin_update" ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Restrict booking creation to approved users (or admins)
DROP POLICY IF EXISTS "bookings_insert" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "bookings_insert_approved" ON public.bookings FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.approved = true)
  )
);

-- Auto-approve admins on role grant
CREATE OR REPLACE FUNCTION public.auto_approve_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    UPDATE public.profiles SET approved = true, approved_at = now() WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS user_roles_auto_approve_admin ON public.user_roles;
CREATE TRIGGER user_roles_auto_approve_admin AFTER INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.auto_approve_admin();

-- Approve existing admins
UPDATE public.profiles SET approved = true, approved_at = now()
WHERE id IN (SELECT user_id FROM public.user_roles WHERE role = 'admin');
