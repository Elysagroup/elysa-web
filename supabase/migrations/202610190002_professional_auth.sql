alter table public.accounts
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

create unique index if not exists accounts_auth_user_id_uidx
  on public.accounts (auth_user_id)
  where auth_user_id is not null;
