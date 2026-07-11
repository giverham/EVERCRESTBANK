import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useSupabaseData<T>(tableName: string, defaultData: T[] = []) {
  const { user, supabaseClient } = useAuth();
  const [data, setData] = useState<T[]>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!user) return;
      try {
        setLoading(true);
        // We only fetch records that belong to the user (RLS handles this anyway)
        const { data: result, error } = await supabaseClient
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted && result) {
          setData(result as T[]);
        }
      } catch (err: any) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    // Subscribe to realtime changes
    const subscription = supabaseClient
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload: any) => {
          if (!mounted) return;
          
          if (payload.eventType === 'INSERT') {
            // Only add if it belongs to the user, or if we have no way to tell here, let's just refetch to be safe/consistent
            // but for better perf, we can manually merge if it matches. 
            // Simple approach: trigger refetch for perfect consistency
            fetchData();
          } else if (payload.eventType === 'UPDATE') {
            setData((current) =>
              current.map((item: any) =>
                item.id === payload.new.id ? { ...item, ...payload.new } : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((current) =>
              current.filter((item: any) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user, tableName]);

  return { data, loading, error };
}
