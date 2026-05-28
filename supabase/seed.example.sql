insert into public.users (name, whatsapp_number)
values ('Rogerio', '5511999999999')
on conflict (whatsapp_number) do update
set name = excluded.name;

insert into public.app_config (key, value)
values ('central_number', '5511999999999')
on conflict (key) do update
set value = excluded.value;
