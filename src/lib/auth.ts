import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  created_at: string;
  updated_at: string;
}

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('clients')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: 'client',
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };
    } else {
      // If no profile exists, create one from auth data
      try {
        const { data: newProfile, error: createError } = await supabase
          .from('clients')
          .insert([{
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            email_verified: user.email_confirmed_at ? true : false,
            email_verified_at: user.email_confirmed_at || null
          }])
          .select()
          .single();
        
        if (!createError && newProfile) {
          return {
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            role: 'client',
            created_at: newProfile.created_at,
            updated_at: newProfile.updated_at
          };
        }
      } catch (createError) {
        console.error('Error creating profile:', createError);
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const redirectAfterLogin = (user: UserProfile) => {
  if (user.role === 'client') {
    // Create a URL-friendly version of the client name
    const clientSlug = user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Try to redirect to personalized dashboard first, fallback to general dashboard
    const personalizedUrl = `/client/${clientSlug}/dashboard`;
    const fallbackUrl = '/client/dashboard';
    
    // For now, use the fallback URL (can be enhanced later with subdomain routing)
    return fallbackUrl;
  }
  
  return '/admin/dashboard'; // For admin users
};

export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

export const requireRole = async (requiredRole: 'client' | 'admin') => {
  const user = await requireAuth();
  if (user.role !== requiredRole) {
    throw new Error('Insufficient permissions');
  }
  return user;
};