// src/app/api/auth/signup/route.ts
import { NextResponse }  from 'next/server';
import bcrypt            from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { full_name, email, password, role } = await req.json();

  // 1) Create a user confirmed immediately (no email step)
  const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });
  if (authErr || !authData.user) {
    return NextResponse.json(
      { error: authErr?.message || 'failed to create auth user' },
      { status: 400 }
    );
  }

  // 2) Hash password for your custom profiles table
  const salt           = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // 3) Insert into profiles via service role
  const { error: profErr } = await supabaseAdmin
    .from('profiles')
    .insert([
      {
        id:         authData.user.id,
        full_name,
        email,
        role,
        password:   hashedPassword,
      },
    ]);
  if (profErr) {
    return NextResponse.json({ error: profErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}