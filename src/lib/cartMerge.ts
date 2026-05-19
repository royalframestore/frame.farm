import { supabase } from './supabase';

export async function mergeGuestCart(userId: string) {
  const sessionId = localStorage.getItem('rfs_session_id');
  if (!sessionId) return;

  // Get guest cart items
  const { data: guestItems, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId);

  if (error || !guestItems?.length) return;

  // For each guest item: upsert into user cart
  for (const item of guestItems) {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', item.product_id)
      .single();

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + item.quantity })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: item.product_id, quantity: item.quantity });
    }
  }

  // Delete guest cart
  await supabase.from('cart_items').delete().eq('session_id', sessionId);
  localStorage.removeItem('rfs_session_id');
}
