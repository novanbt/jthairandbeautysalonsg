/**
 * JT HAIR & BEAUTY SALON SG — SUPABASE CLIENT & BACKEND INTEGRATION
 * Dynamically loads environment variables from /api/config (.env)
 */

(function () {
  let supabase = null;
  let initPromise = null;

  const DEFAULT_SUPABASE_URL = 'https://larknxsxfgyjtcerbnko.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_NvLecSzMOqNPw3_C5BebKg_r0uizxu7';

  // Load config from server (/api/config) or fallback to default publishable credentials
  async function loadConfigAndInit() {
    if (supabase) return supabase;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      let supabaseUrl = DEFAULT_SUPABASE_URL;
      let supabaseAnonKey = DEFAULT_SUPABASE_ANON_KEY;

      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const config = await response.json();
          if (config.supabaseUrl) supabaseUrl = config.supabaseUrl;
          if (config.supabaseAnonKey) supabaseAnonKey = config.supabaseAnonKey;
        }
      } catch (err) {
        console.warn('[Supabase] /api/config unavailable, using default publishable keys:', err);
      }

      if (window.supabase && supabaseUrl && supabaseAnonKey) {
        try {
          supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
          console.log('[Supabase] Initialized successfully.');
        } catch (err) {
          console.error('[Supabase] Client creation failed:', err);
        }
      } else if (!window.supabase) {
        console.warn('[Supabase] Supabase JS SDK not detected on page.');
      }
      return supabase;
    })();

    return initPromise;
  }

  // Format JS booking object to Supabase row format
  function toSupabaseRow(booking) {
    return {
      id: booking.id || ('BK-' + Date.now().toString(36).toUpperCase()),
      full_name: booking.fullName || booking.full_name || '',
      phone_number: booking.phoneNumber || booking.phone_number || '',
      service: booking.service || '',
      date: booking.date || '',
      time: booking.time || '',
      stylist: booking.stylist || 'Any Available Stylist',
      note: booking.note || '',
      status: booking.status || 'pending',
      created_at: booking.createdAt || booking.created_at || new Date().toISOString()
    };
  }

  // Format Supabase row back to JS booking object
  function fromSupabaseRow(row) {
    return {
      id: row.id,
      fullName: row.full_name,
      phoneNumber: row.phone_number,
      service: row.service,
      date: row.date,
      time: row.time,
      stylist: row.stylist || 'Any Available Stylist',
      note: row.note || '',
      status: row.status || 'pending',
      createdAt: row.created_at
    };
  }

  /**
   * Save a new booking to Supabase
   * @param {Object} bookingData 
   * @returns {Promise<{success: boolean, data?: any, error?: string, fallbackData?: any}>}
   */
  async function saveBooking(bookingData) {
    const client = await loadConfigAndInit();
    const row = toSupabaseRow(bookingData);

    if (!client) {
      console.warn('[Supabase] Client not connected. Saved to local storage fallback.');
      return { success: false, error: 'Supabase client not initialized', fallbackData: fromSupabaseRow(row) };
    }

    try {
      const { data, error } = await client
        .from('bookings')
        .insert([row])
        .select();

      if (error) {
        console.error('[Supabase] Insert error:', error);
        return { success: false, error: error.message, fallbackData: fromSupabaseRow(row) };
      }

      const savedItem = data && data[0] ? fromSupabaseRow(data[0]) : fromSupabaseRow(row);
      return { success: true, data: savedItem };
    } catch (err) {
      console.error('[Supabase] Save exception:', err);
      return { success: false, error: err.message, fallbackData: fromSupabaseRow(row) };
    }
  }

  /**
   * Fetch all bookings from Supabase
   * @returns {Promise<Array>}
   */
  async function fetchBookings() {
    const client = await loadConfigAndInit();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase] Fetch error:', error);
        return [];
      }

      return (data || []).map(fromSupabaseRow);
    } catch (err) {
      console.error('[Supabase] Fetch exception:', err);
      return [];
    }
  }

  /**
   * Update booking status in Supabase
   * @param {string} id 
   * @param {string} status 
   */
  async function updateBookingStatus(id, status) {
    const client = await loadConfigAndInit();
    if (!client) return false;

    try {
      const { error } = await client
        .from('bookings')
        .update({ status: status })
        .eq('id', id);

      if (error) {
        console.error('[Supabase] Status update error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Supabase] Status update exception:', err);
      return false;
    }
  }

  /**
   * Delete a booking from Supabase
   * @param {string} id 
   */
  async function deleteBooking(id) {
    const client = await loadConfigAndInit();
    if (!client) return false;

    try {
      const { error } = await client
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase] Delete error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Supabase] Delete exception:', err);
      return false;
    }
  }

  /**
   * Subscribe to real-time changes in bookings table
   * @param {Function} onInsert 
   * @param {Function} onUpdate 
   * @param {Function} onDelete 
   */
  async function subscribeToBookings(onInsert, onUpdate, onDelete) {
    const client = await loadConfigAndInit();
    if (!client) return null;

    try {
      const channel = client
        .channel('public:bookings')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'bookings' },
          (payload) => {
            if (onInsert && payload.new) onInsert(fromSupabaseRow(payload.new));
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'bookings' },
          (payload) => {
            if (onUpdate && payload.new) onUpdate(fromSupabaseRow(payload.new));
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'bookings' },
          (payload) => {
            if (onDelete && payload.old) onDelete(payload.old.id);
          }
        )
        .subscribe((status) => {
          console.log('[Supabase Realtime] Channel status:', status);
        });

      return channel;
    } catch (err) {
      console.error('[Supabase Realtime] Setup error:', err);
      return null;
    }
  }

  // Export globally
  window.JTSupabase = {
    init: loadConfigAndInit,
    saveBooking: saveBooking,
    fetchBookings: fetchBookings,
    updateBookingStatus: updateBookingStatus,
    deleteBooking: deleteBooking,
    subscribeToBookings: subscribeToBookings,
    toSupabaseRow: toSupabaseRow,
    fromSupabaseRow: fromSupabaseRow
  };

  // Trigger initial background load
  loadConfigAndInit();
})();
