/**
 * JT HAIR & BEAUTY SALON SG — ADMIN ENGINE (v2.0)
 * Handles Auth, Services CRUD, Before/After Slider CRUD, Working Hours, Bookings Management & Live Sync
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. STORAGE KEYS & DEFAULT DATA
  // =========================================================================
  const KEYS = {
    AUTH: 'jt_admin_auth',
    SESSION: 'jt_admin_session',
    BOOKINGS: 'jt_bookings',
    SERVICES_CONFIG: 'jt_services_config',
    SLIDERS_CONFIG: 'jt_sliders_config',
    SCHEDULE_CONFIG: 'jt_schedule_config',
    STYLISTS_CONFIG: 'jt_stylists_config'
  };

  const DEFAULT_AUTH = {
    email: 'admin@jthairsalonsg.com',
    password: '86869418'
  };

  const DEFAULT_STYLISTS = [
    {
      id: 'stylist-1',
      name: 'Jessica Tan',
      role: 'Master Director',
      specialty: 'Extensions & Hair Transformation',
      experience: '12+ Years Exp',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'stylist-2',
      name: 'Marcus Lee',
      role: 'Senior Colorist',
      specialty: 'Balayage & Creative Color',
      experience: '8+ Years Exp',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'stylist-3',
      name: 'Chloe Wang',
      role: 'Lead Stylist',
      specialty: 'Editorial Waves & Scalp Spa',
      experience: '6+ Years Exp',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'stylist-4',
      name: 'David Lim',
      role: 'Precision Specialist',
      specialty: 'Precision Cuts & Blowouts',
      experience: '7+ Years Exp',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      active: true
    }
  ];

  const DEFAULT_SERVICES = {
    tag: 'Our Services',
    icon: '✦',
    cards: [
      {
        id: 'cut',
        title: 'CUT',
        desc: 'Precision cuts that define you.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjapZIyj2vAUqn9u-kdLWxUPWGZfdWSCLxxO0ET7ef4S3Ln3uZLAU6Wkl7l6OsIGZJkEmOYisVmvJPII3oR72qDNO9iZTynW4xfv-Q8w-z9oxQe4Xhe4tX2EqV_xo1RJ1dvjqjb1sG1kT0lmi9JFYIQKcG2OTNj9ftmYEZHueKFZtqTBc4UG3RH6moxR0DC_L99LSLMUlOtqQ2aCRF4tvPsfZJgzZ2udwuuuuQlgHL2P67UZNOGmAEc2OyHSySLNETFO5M6y-aayYxJg4'
      },
      {
        id: 'color',
        title: 'COLOR',
        desc: 'Rich, radiant color that turns heads.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBNUA8FSzNSAfJaax5udaR-BkouZuYEj-OY55fhMl5v4BBHIMov3_9dB4DxGVnEXW0ilpQS7LJgRKW70sa_fzQb35KtG6pbsPpV0TJ-nC3qvfVVy-pLaltczAjIuocJrbUl7pYNOqDZYdrJiRJild9EZf3-99mJwXu86_wAFZO2NdMq4lqMKu75HapABcNuKOQzW5SQuP982wT0cREIkNdt_yMOc_Ud5Q65qYq7Fvr7ZfOJ54Oa8UZcmAx3vAuco-lTtbnqUP1BQgDT0U'
      },
      {
        id: 'style',
        title: 'STYLE',
        desc: 'Blowouts, waves & effortless styling.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTYquhy8ZBgUDCeWTrVg9Eebcj5kAqaxe-tm7nWvD4JSMs1f5iQ6oWDcymbLuki3gHKMN0kcWzZ-FNGeG6-7Pi2KDJtafkm799Sv-U7lWep9-41DZ4vkSZBZINCsMSASlQHIOxzbcefANJqKOWvDHdz18tskpVzfxvBdsqZzsTfnTgvFzp27uOyEhPaDGA9rg07Gi4zvhXiie__ZJTNLFH30Q-lfDnANEub3V91nA6I1yLYEMK5BTYEuDQkGQNcqnJ6cathRqepxVJ_nY'
      }
    ]
  };

  const DEFAULT_SLIDERS = {
    headline: 'BEFORE & AFTER',
    subtitle: 'Real transformations. Real confidence.',
    sliders: [
      {
        id: 'look-1',
        lookNumber: '01',
        title: '01 / Silk Straight & Gloss',
        subtitle: 'Look 01 of 03',
        beforeImg: 'before-1.png',
        afterImg: 'after-1.png'
      },
      {
        id: 'look-2',
        lookNumber: '02',
        title: '02 / Rich Brunette Waves',
        subtitle: 'Look 02 of 03',
        beforeImg: 'before-2.png',
        afterImg: 'after-2.png'
      },
      {
        id: 'look-3',
        lookNumber: '03',
        title: '03 / Golden Balayage Melt & Curls',
        subtitle: 'Look 03 of 03',
        beforeImg: 'before-3.png',
        afterImg: 'after-3.png'
      }
    ]
  };

  const DEFAULT_SCHEDULE = {
    openingTime: '10:30',
    closingTime: '20:30',
    slotInterval: '30',
    slotCapacity: '2',
    recurringBlockedHours: [
      { id: 'lunch-break', startTime: '13:00', endTime: '14:00', reason: 'Daily Lunch Break' }
    ],
    blockedDates: [
      { date: '2026-12-25', reason: 'Christmas Day' },
      { date: '2027-01-01', reason: "New Year's Day" }
    ],
    dateBlockedSlots: {}
  };

  // Sample initial bookings if empty
  const SAMPLE_BOOKINGS = [
    {
      id: 'BK-' + Date.now().toString(36).toUpperCase(),
      fullName: 'Evelyn Tan',
      phoneNumber: '+65 9123 4567',
      service: 'Colour — 58+',
      date: new Date().toISOString().split('T')[0],
      time: '2:30 PM',
      stylist: 'Marcus Lee – Senior Colorist',
      note: 'Looking for a warm honey balayage consultation',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: 'BK-' + (Date.now() - 3600000).toString(36).toUpperCase(),
      fullName: 'Sarah Lim',
      phoneNumber: '+65 8234 5678',
      service: 'Hair Extensions — From 1+ / strand',
      date: new Date().toISOString().split('T')[0],
      time: '11:30 AM',
      stylist: 'Jessica Tan – Master Director',
      note: '22-inch seamless tape extensions consultation',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'BK-' + (Date.now() - 86400000).toString(36).toUpperCase(),
      fullName: 'Darren Wong',
      phoneNumber: '+65 9876 5432',
      service: 'Men – Wash & Cut — 20',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '4:00 PM',
      stylist: 'David Lim – Precision Specialist',
      note: 'First time client',
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  // Utility: Canvas-based Image Compression for fast local storage without hitting quotas
  function compressImage(file, maxWidth = 1000, maxHeight = 1000, quality = 0.85) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / maxWidth > height / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          try {
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } catch(err) {
            resolve(e.target.result);
          }
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  // Helper Functions for Data Storage
  function getStored(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStored(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom storage event for same-page listeners
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch (e) {
      console.error('Storage quota error:', e);
      showToast('Storage quota warning. Images have been auto-optimized.', 'error');
      return false;
    }
  }

  // Initialize defaults if not present
  if (!localStorage.getItem(KEYS.AUTH)) setStored(KEYS.AUTH, DEFAULT_AUTH);
  if (!localStorage.getItem(KEYS.SERVICES_CONFIG)) setStored(KEYS.SERVICES_CONFIG, DEFAULT_SERVICES);
  if (!localStorage.getItem(KEYS.SLIDERS_CONFIG)) setStored(KEYS.SLIDERS_CONFIG, DEFAULT_SLIDERS);
  if (!localStorage.getItem(KEYS.SCHEDULE_CONFIG)) setStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
  if (!localStorage.getItem(KEYS.STYLISTS_CONFIG)) setStored(KEYS.STYLISTS_CONFIG, DEFAULT_STYLISTS);
  if (!localStorage.getItem(KEYS.BOOKINGS)) setStored(KEYS.BOOKINGS, SAMPLE_BOOKINGS);

  // =========================================================================
  // 2. TOAST NOTIFICATIONS
  // =========================================================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    toast.className = `px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-2xl flex items-center gap-2.5 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto border ${
      isSuccess 
        ? 'bg-espressoCard text-cream border-blush-300/40' 
        : 'bg-rose-950 text-rose-200 border-rose-500/40'
    }`;

    toast.innerHTML = `
      <span>${isSuccess ? '✦' : '⚠️'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-4');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // =========================================================================
  // 3. AUTHENTICATION CONTROLLER
  // =========================================================================
  const authView = document.getElementById('authView');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  function checkSession() {
    const session = getStored(KEYS.SESSION, null);
    if (session && session.isLoggedIn) {
      if (authView) authView.classList.add('hidden');
      if (adminApp) adminApp.classList.remove('hidden');
      refreshAllData();
    } else {
      if (authView) authView.classList.remove('hidden');
      if (adminApp) adminApp.classList.add('hidden');
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const auth = getStored(KEYS.AUTH, DEFAULT_AUTH);
      const email = loginEmail.value.trim().toLowerCase();
      const password = loginPassword.value.trim();

      if (email === auth.email.toLowerCase() && password === auth.password) {
        if (loginError) loginError.classList.add('hidden');
        setStored(KEYS.SESSION, { isLoggedIn: true, email: auth.email, loggedAt: new Date().toISOString() });
        showToast('Welcome back! Signed in successfully.');
        checkSession();
      } else {
        if (loginError) {
          loginError.textContent = 'Invalid credentials. Please verify email and password.';
          loginError.classList.remove('hidden');
        }
      }
    });
  }

  if (togglePasswordBtn && loginPassword) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPwd = loginPassword.type === 'password';
      loginPassword.type = isPwd ? 'text' : 'password';
      togglePasswordBtn.textContent = isPwd ? 'Hide Password' : 'Show Password';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(KEYS.SESSION);
      showToast('Logged out of Admin Portal.');
      checkSession();
    });
  }

  // Live Singapore Clock
  function updateLiveClock() {
    const clockEl = document.getElementById('liveTimeClock');
    if (!clockEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    clockEl.textContent = timeStr;
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // =========================================================================
  // 4. TAB NAVIGATION
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(tabName) {
    tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active', 'bg-blush-300/15', 'text-blush-300', 'border-blush-300/30');
        btn.classList.remove('text-cream/70', 'border-transparent');
      } else {
        btn.classList.remove('active', 'bg-blush-300/15', 'text-blush-300', 'border-blush-300/30');
        btn.classList.add('text-cream/70', 'border-transparent');
      }
    });

    tabContents.forEach(content => {
      if (content.id === `tab-${tabName}`) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.querySelectorAll('[data-switch-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.switchTab));
  });

  // =========================================================================
  // 5. BOOKINGS CONTROLLER & MANAGER
  // =========================================================================
  let currentBookingFilter = 'all';
  let bookingSearchQuery = '';

  function getBookings() {
    return getStored(KEYS.BOOKINGS, []);
  }

  function renderBookings() {
    const bookings = getBookings();
    const recentTbody = document.getElementById('recentBookingsTbody');
    const allTbody = document.getElementById('allBookingsTbody');
    const noBookingsMsg = document.getElementById('noBookingsMsg');
    const sidebarBadge = document.getElementById('sidebarBookingBadge');

    // Update Stats
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = bookings.filter(b => b.date === todayStr).length;

    const totalEl = document.getElementById('statTotalBookings');
    const pendingEl = document.getElementById('statPendingBookings');
    const todayEl = document.getElementById('statTodayBookings');

    if (totalEl) totalEl.textContent = total;
    if (pendingEl) pendingEl.textContent = pending;
    if (todayEl) todayEl.textContent = todayCount;
    if (sidebarBadge) sidebarBadge.textContent = pending;

    // Filtered bookings
    const filtered = bookings.filter(b => {
      const matchFilter = currentBookingFilter === 'all' || b.status === currentBookingFilter;
      const q = bookingSearchQuery.toLowerCase();
      const matchSearch = !q || 
        b.fullName.toLowerCase().includes(q) || 
        b.phoneNumber.toLowerCase().includes(q) || 
        b.service.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });

    // Helper for Status Badge
    function getStatusBadge(status) {
      switch (status) {
        case 'confirmed':
          return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Confirmed</span>`;
        case 'completed':
          return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">Completed</span>`;
        case 'cancelled':
          return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">Cancelled</span>`;
        case 'pending':
        default:
          return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending</span>`;
      }
    }

    // Helper for Clean Phone Number for WhatsApp Link
    function getWhatsAppLink(phone, name, date, time, service) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(`Hi ${name}! This is JT Hair & Beauty Salon SG regarding your appointment for ${service} on ${date} at ${time}.`);
      return `https://wa.me/${cleanPhone}?text=${msg}`;
    }

    // Render Recent 5 (Overview Tab)
    if (recentTbody) {
      recentTbody.innerHTML = '';
      const recentList = [...bookings].reverse().slice(0, 5);
      if (recentList.length === 0) {
        recentTbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-cream/40">No bookings yet.</td></tr>`;
      } else {
        recentList.forEach(b => {
          const row = document.createElement('tr');
          row.className = 'hover:bg-white/[0.02] transition-colors';
          row.innerHTML = `
            <td class="py-3.5 font-bold text-cream">${b.fullName}</td>
            <td class="py-3.5 text-cream/80 font-mono">${b.phoneNumber}</td>
            <td class="py-3.5 text-blush-300 font-medium">${b.service}</td>
            <td class="py-3.5 text-cream/90">${b.date} <span class="text-cream/50">@</span> ${b.time}</td>
            <td class="py-3.5">${getStatusBadge(b.status)}</td>
            <td class="py-3.5 text-right">
              <a href="${getWhatsAppLink(b.phoneNumber, b.fullName, b.date, b.time, b.service)}" target="_blank" class="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 transition-all text-[11px] font-bold mr-1">
                WhatsApp
              </a>
            </td>
          `;
          recentTbody.appendChild(row);
        });
      }
    }

    // Render All Bookings (Bookings Tab)
    if (allTbody) {
      allTbody.innerHTML = '';
      if (filtered.length === 0) {
        if (noBookingsMsg) noBookingsMsg.classList.remove('hidden');
      } else {
        if (noBookingsMsg) noBookingsMsg.classList.add('hidden');
        [...filtered].reverse().forEach(b => {
          const row = document.createElement('tr');
          row.className = 'hover:bg-white/[0.02] transition-colors';
          row.innerHTML = `
            <td class="py-4">
              <div class="font-bold text-cream text-sm">${b.fullName}</div>
              <div class="text-cream/60 font-mono text-xs mt-0.5">${b.phoneNumber}</div>
            </td>
            <td class="py-4">
              <div class="text-blush-300 font-bold">${b.service}</div>
              <div class="text-cream/50 text-[11px] mt-0.5">${b.stylist || 'Any Available Stylist'}</div>
            </td>
            <td class="py-4">
              <div class="text-cream font-medium">${b.date}</div>
              <div class="text-cream/60 font-mono text-xs mt-0.5">${b.time}</div>
            </td>
            <td class="py-4 max-w-[160px] truncate text-cream/70 text-[11px]" title="${b.note || 'None'}">
              ${b.note || '<span class="text-cream/30">—</span>'}
            </td>
            <td class="py-4">
              <select data-booking-id="${b.id}" class="booking-status-select px-2.5 py-1 rounded-xl bg-espressoDark border border-white/20 text-xs font-semibold text-cream">
                <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>✓ Confirmed</option>
                <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>✦ Completed</option>
                <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>✕ Cancelled</option>
              </select>
            </td>
            <td class="py-4 text-right space-x-1 whitespace-nowrap">
              <a href="${getWhatsAppLink(b.phoneNumber, b.fullName, b.date, b.time, b.service)}" target="_blank" class="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all text-xs font-bold">
                WhatsApp
              </a>
              <button data-delete-booking="${b.id}" class="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-all text-xs font-bold cursor-pointer">
                Delete
              </button>
            </td>
          `;
          allTbody.appendChild(row);
        });
      }
    }

    // Attach Status Change Listeners
    document.querySelectorAll('.booking-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.dataset.bookingId;
        const newStatus = e.target.value;
        const list = getBookings();
        const item = list.find(x => x.id === id);
        if (item) {
          item.status = newStatus;
          setStored(KEYS.BOOKINGS, list);
          showToast(`Booking for ${item.fullName} updated to ${newStatus.toUpperCase()}`);
          renderBookings();

          // Sync Status Update to Supabase
          if (window.JTSupabase && typeof window.JTSupabase.updateBookingStatus === 'function') {
            window.JTSupabase.updateBookingStatus(id, newStatus).then(ok => {
              if (ok) console.log(`[Admin] Booking ${id} status updated in Supabase`);
            }).catch(err => console.error('[Admin] Supabase status sync error:', err));
          }
        }
      });
    });

    // Attach Delete Listeners
    document.querySelectorAll('[data-delete-booking]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.deleteBooking;
        if (confirm('Are you sure you want to delete this booking record?')) {
          let list = getBookings();
          list = list.filter(x => x.id !== id);
          setStored(KEYS.BOOKINGS, list);
          showToast('Booking deleted successfully.');
          renderBookings();

          // Sync Deletion to Supabase
          if (window.JTSupabase && typeof window.JTSupabase.deleteBooking === 'function') {
            window.JTSupabase.deleteBooking(id).then(ok => {
              if (ok) console.log(`[Admin] Booking ${id} deleted from Supabase`);
            }).catch(err => console.error('[Admin] Supabase delete sync error:', err));
          }
        }
      });
    });
  }

  // Booking Filter Buttons
  document.querySelectorAll('.booking-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.booking-filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-blush-300', 'text-espresso');
        b.classList.add('bg-white/5', 'text-cream/70');
      });
      btn.classList.add('active', 'bg-blush-300', 'text-espresso');
      btn.classList.remove('bg-white/5', 'text-cream/70');
      currentBookingFilter = btn.dataset.filter;
      renderBookings();
    });
  });

  // Booking Search Input
  const bookingSearchInput = document.getElementById('bookingSearchInput');
  if (bookingSearchInput) {
    bookingSearchInput.addEventListener('input', (e) => {
      bookingSearchQuery = e.target.value.trim();
      renderBookings();
    });
  }

  // Export CSV
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const bookings = getBookings();
      if (bookings.length === 0) {
        showToast('No bookings available to export.', 'error');
        return;
      }
      let csv = 'Booking ID,Client Name,Phone Number,Service,Date,Time,Stylist,Note,Status,Created At\n';
      bookings.forEach(b => {
        csv += `"${b.id}","${b.fullName}","${b.phoneNumber}","${b.service}","${b.date}","${b.time}","${b.stylist || ''}","${(b.note || '').replace(/"/g, '""')}","${b.status}","${b.createdAt}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `JT_Hair_Salon_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Bookings CSV exported successfully! 📥');
    });
  }

  // Manual Booking Modal
  const bookingModal = document.getElementById('bookingModal');
  const addNewBookingBtn = document.getElementById('addNewBookingBtn');
  const quickAddBookingBtn = document.getElementById('quickAddBookingBtn');
  const closeBookingModalBtn = document.getElementById('closeBookingModalBtn');
  const cancelBookingModalBtn = document.getElementById('cancelBookingModalBtn');
  const manualBookingForm = document.getElementById('manualBookingForm');

  function openBookingModal() {
    if (manualBookingForm) manualBookingForm.reset();
    const dateInput = document.getElementById('manualDate');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    if (bookingModal) {
      bookingModal.classList.remove('hidden');
      bookingModal.classList.add('flex');
    }
  }

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.classList.add('hidden');
      bookingModal.classList.remove('flex');
    }
  }

  if (addNewBookingBtn) addNewBookingBtn.addEventListener('click', openBookingModal);
  if (quickAddBookingBtn) quickAddBookingBtn.addEventListener('click', openBookingModal);
  if (closeBookingModalBtn) closeBookingModalBtn.addEventListener('click', closeBookingModal);
  if (cancelBookingModalBtn) cancelBookingModalBtn.addEventListener('click', closeBookingModal);

  if (manualBookingForm) {
    manualBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newBooking = {
        id: 'BK-' + Date.now().toString(36).toUpperCase(),
        fullName: document.getElementById('manualName').value.trim(),
        phoneNumber: document.getElementById('manualPhone').value.trim(),
        service: document.getElementById('manualService').value,
        date: document.getElementById('manualDate').value,
        time: document.getElementById('manualTime').value.trim(),
        stylist: document.getElementById('manualStylist').value.trim() || 'Any Available Stylist',
        note: document.getElementById('manualNote').value.trim(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      const list = getBookings();
      list.push(newBooking);
      setStored(KEYS.BOOKINGS, list);
      showToast('New appointment created and confirmed! ✦');
      closeBookingModal();
      renderBookings();

      // Sync Manual Booking to Supabase Cloud Database
      if (window.JTSupabase && typeof window.JTSupabase.saveBooking === 'function') {
        window.JTSupabase.saveBooking(newBooking).then(res => {
          if (res.success) {
            console.log('[Admin] Manual booking saved to Supabase:', res.data);
          }
        }).catch(err => {
          console.error('[Admin] Supabase manual save error:', err);
        });
      }
    });
  }

  // =========================================================================
  // 6. "OUR SERVICES" SECTION EDITOR CONTROLLER
  // =========================================================================
  const servicesSectionTag = document.getElementById('servicesSectionTag');
  const servicesSectionIcon = document.getElementById('servicesSectionIcon');
  const saveServicesHeadingsBtn = document.getElementById('saveServicesHeadingsBtn');
  const serviceCardsContainer = document.getElementById('serviceCardsContainer');
  const addServiceCardBtn = document.getElementById('addServiceCardBtn');
  const serviceCardModal = document.getElementById('serviceCardModal');
  const serviceCardForm = document.getElementById('serviceCardForm');
  const closeServiceModalBtn = document.getElementById('closeServiceModalBtn');
  const cancelServiceModalBtn = document.getElementById('cancelServiceModalBtn');

  function renderServicesEditor() {
    const config = getStored(KEYS.SERVICES_CONFIG, DEFAULT_SERVICES);
    if (servicesSectionTag) servicesSectionTag.value = config.tag || 'Our Services';
    if (servicesSectionIcon) servicesSectionIcon.value = config.icon || '✦';

    const sidebarServicesBadge = document.getElementById('sidebarServicesBadge');
    if (sidebarServicesBadge) sidebarServicesBadge.textContent = config.cards.length;

    if (!serviceCardsContainer) return;
    serviceCardsContainer.innerHTML = '';

    config.cards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'glass-panel p-5 rounded-2xl flex flex-col justify-between group relative overflow-hidden border border-white/10';
      cardEl.innerHTML = `
        <div>
          <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-espressoDark">
            <img src="${card.image}" alt="${card.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/20 to-transparent"></div>
            <div class="absolute bottom-3 left-3">
              <span class="text-xs font-bold uppercase tracking-widest text-blush-400">Card 0${index + 1}</span>
              <h4 class="text-2xl font-condensed-impact text-cream uppercase">${card.title}</h4>
            </div>
          </div>
          <p class="text-xs text-cream/80 mb-4 leading-relaxed">${card.desc}</p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-white/10">
          <button data-edit-service="${index}" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
            ✏️ Edit Card
          </button>
          ${config.cards.length > 1 ? `
            <button data-delete-service="${index}" class="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
              🗑 Delete
            </button>
          ` : ''}
        </div>
      `;
      serviceCardsContainer.appendChild(cardEl);
    });

    // Dedicated "+ Add Another Service Card" dashed card in grid
    const addCard = document.createElement('div');
    addCard.className = 'border-2 border-dashed border-white/20 hover:border-blush-300 rounded-3xl p-6 text-center cursor-pointer transition-all bg-espressoDark/40 hover:bg-espressoDark/80 group flex flex-col items-center justify-center min-h-[280px] gap-3';
    addCard.id = 'bottomAddServiceCard';
    addCard.innerHTML = `
      <div class="w-12 h-12 rounded-full bg-blush-300/20 text-blush-300 group-hover:bg-blush-300 group-hover:text-espresso flex items-center justify-center text-xl font-bold transition-all">
        +
      </div>
      <div>
        <h4 class="text-sm font-bold text-cream group-hover:text-blush-300 uppercase tracking-wider transition-colors">
          + Add Another Service Card
        </h4>
        <p class="text-[11px] text-cream/50 mt-0.5">Click to add Card 0${config.cards.length + 1} to the homepage showcase</p>
      </div>
    `;
    addCard.addEventListener('click', () => openServiceModal(-1));
    serviceCardsContainer.appendChild(addCard);

    // Edit listeners
    document.querySelectorAll('[data-edit-service]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.editService, 10);
        openServiceModal(idx);
      });
    });

    // Delete listeners
    document.querySelectorAll('[data-delete-service]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.deleteService, 10);
        if (confirm('Are you sure you want to delete this service card?')) {
          const cfg = getStored(KEYS.SERVICES_CONFIG, DEFAULT_SERVICES);
          cfg.cards.splice(idx, 1);
          setStored(KEYS.SERVICES_CONFIG, cfg);
          showToast('Service card deleted.');
          renderServicesEditor();
        }
      });
    });
  }

  // Service Modal Image Preview & Upload Logic
  const serviceDropZone = document.getElementById('serviceDropZone');
  const serviceFileInput = document.getElementById('serviceFileInput');
  const serviceCardImage = document.getElementById('serviceCardImage');
  const servicePreviewContainer = document.getElementById('servicePreviewContainer');
  const servicePreviewImg = document.getElementById('servicePreviewImg');

  function updateServicePreview(src) {
    if (src && src.trim()) {
      if (servicePreviewImg) servicePreviewImg.src = src;
      if (servicePreviewContainer) servicePreviewContainer.classList.remove('hidden');
    } else {
      if (servicePreviewContainer) servicePreviewContainer.classList.add('hidden');
    }
  }

  if (serviceCardImage) {
    serviceCardImage.addEventListener('input', (e) => updateServicePreview(e.target.value));
  }

  if (serviceDropZone && serviceFileInput) {
    serviceDropZone.addEventListener('click', () => serviceFileInput.click());
    
    // Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
      serviceDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        serviceDropZone.classList.add('border-blush-400', 'bg-espressoDark/90');
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      serviceDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        serviceDropZone.classList.remove('border-blush-400', 'bg-espressoDark/90');
      });
    });
    serviceDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      serviceDropZone.classList.remove('border-blush-400', 'bg-espressoDark/90');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleServiceFile(file);
      } else {
        showToast('Please upload a valid image file.', 'error');
      }
    });

    serviceFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleServiceFile(file);
    });
  }

  async function handleServiceFile(file) {
    try {
      const compressedDataUrl = await compressImage(file, 1000, 1000, 0.85);
      if (serviceCardImage) serviceCardImage.value = compressedDataUrl;
      updateServicePreview(compressedDataUrl);
      showToast('Image optimized and loaded from device! ✦');
    } catch (e) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (serviceCardImage) serviceCardImage.value = dataUrl;
        updateServicePreview(dataUrl);
        showToast('Image loaded from device! ✦');
      };
      reader.readAsDataURL(file);
    }
  }

  function openServiceModal(index = -1) {
    const config = getStored(KEYS.SERVICES_CONFIG, DEFAULT_SERVICES);
    const modalTitle = document.getElementById('serviceModalTitle');
    const idxInput = document.getElementById('serviceCardIndex');
    const titleInput = document.getElementById('serviceCardTitle');
    const descInput = document.getElementById('serviceCardDesc');
    const imgInput = document.getElementById('serviceCardImage');

    if (serviceCardForm) serviceCardForm.reset();
    if (serviceFileInput) serviceFileInput.value = '';

    if (index >= 0 && config.cards && config.cards[index]) {
      const card = config.cards[index];
      if (modalTitle) modalTitle.textContent = `Edit "${card.title}" Card`;
      if (idxInput) idxInput.value = String(index);
      if (titleInput) titleInput.value = card.title;
      if (descInput) descInput.value = card.desc;
      if (imgInput) imgInput.value = card.image;
      updateServicePreview(card.image);
    } else {
      const nextCardNum = String((config.cards ? config.cards.length : 0) + 1).padStart(2, '0');
      if (modalTitle) modalTitle.textContent = `Add Service Card 0${(config.cards ? config.cards.length : 0) + 1}`;
      if (idxInput) idxInput.value = '-1';
      if (titleInput) titleInput.value = '';
      if (descInput) descInput.value = '';
      if (imgInput) imgInput.value = '';
      updateServicePreview('');
    }

    if (serviceCardModal) {
      serviceCardModal.classList.remove('hidden');
      serviceCardModal.classList.add('flex');
    }
  }

  function closeServiceModal() {
    if (serviceCardModal) {
      serviceCardModal.classList.add('hidden');
      serviceCardModal.classList.remove('flex');
    }
  }

  if (addServiceCardBtn) addServiceCardBtn.addEventListener('click', () => openServiceModal(-1));
  if (closeServiceModalBtn) closeServiceModalBtn.addEventListener('click', closeServiceModal);
  if (cancelServiceModalBtn) cancelServiceModalBtn.addEventListener('click', closeServiceModal);

  if (serviceCardForm) {
    serviceCardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawIdx = document.getElementById('serviceCardIndex').value;
      const idx = (rawIdx !== '' && rawIdx !== '-1' && !isNaN(parseInt(rawIdx, 10))) ? parseInt(rawIdx, 10) : -1;
      const title = document.getElementById('serviceCardTitle').value.trim();
      const desc = document.getElementById('serviceCardDesc').value.trim();
      const image = document.getElementById('serviceCardImage').value.trim();

      if (!title) {
        showToast('Please enter a service card title.', 'error');
        return;
      }

      if (!image) {
        showToast('Please upload or provide an image for the service card.', 'error');
        return;
      }

      const config = getStored(KEYS.SERVICES_CONFIG, DEFAULT_SERVICES);
      if (!config.cards) config.cards = [];

      if (idx >= 0 && idx < config.cards.length) {
        config.cards[idx] = { ...config.cards[idx], title, desc, image };
        showToast(`Service card "${title}" updated! ✦`);
      } else {
        config.cards.push({ id: 'srv-' + Date.now(), title, desc, image });
        showToast(`New service card "${title}" added! ✦`);
      }

      setStored(KEYS.SERVICES_CONFIG, config);
      closeServiceModal();
      renderServicesEditor();
    });
  }

  if (saveServicesHeadingsBtn) {
    saveServicesHeadingsBtn.addEventListener('click', () => {
      const config = getStored(KEYS.SERVICES_CONFIG, DEFAULT_SERVICES);
      config.tag = servicesSectionTag.value.trim() || 'Our Services';
      config.icon = servicesSectionIcon.value.trim() || '✦';
      setStored(KEYS.SERVICES_CONFIG, config);
      showToast('Services section headers saved! ✦');
    });
  }


  // =========================================================================
  // 7. "BEFORE & AFTER" SLIDERS MANAGER
  // =========================================================================
  const baHeadline = document.getElementById('baHeadline');
  const baSubtitle = document.getElementById('baSubtitle');
  const saveBaHeadingsBtn = document.getElementById('saveBaHeadingsBtn');
  const slidersListContainer = document.getElementById('slidersListContainer');
  const addSliderBtn = document.getElementById('addSliderBtn');
  const sliderModal = document.getElementById('sliderModal');
  const sliderForm = document.getElementById('sliderForm');
  const closeSliderModalBtn = document.getElementById('closeSliderModalBtn');
  const cancelSliderModalBtn = document.getElementById('cancelSliderModalBtn');

  // Slider Before/After Upload & Preview Elements
  const beforeDropZone = document.getElementById('beforeDropZone');
  const beforeFileInput = document.getElementById('beforeFileInput');
  const sliderBeforeImg = document.getElementById('sliderBeforeImg');
  const beforePreviewContainer = document.getElementById('beforePreviewContainer');
  const beforePreviewImg = document.getElementById('beforePreviewImg');

  const afterDropZone = document.getElementById('afterDropZone');
  const afterFileInput = document.getElementById('afterFileInput');
  const sliderAfterImg = document.getElementById('sliderAfterImg');
  const afterPreviewContainer = document.getElementById('afterPreviewContainer');
  const afterPreviewImg = document.getElementById('afterPreviewImg');

  function updateBeforePreview(src) {
    if (src && src.trim()) {
      if (beforePreviewImg) beforePreviewImg.src = src;
      if (beforePreviewContainer) beforePreviewContainer.classList.remove('hidden');
    } else {
      if (beforePreviewContainer) beforePreviewContainer.classList.add('hidden');
    }
  }

  function updateAfterPreview(src) {
    if (src && src.trim()) {
      if (afterPreviewImg) afterPreviewImg.src = src;
      if (afterPreviewContainer) afterPreviewContainer.classList.remove('hidden');
    } else {
      if (afterPreviewContainer) afterPreviewContainer.classList.add('hidden');
    }
  }

  if (sliderBeforeImg) sliderBeforeImg.addEventListener('input', (e) => updateBeforePreview(e.target.value));
  if (sliderAfterImg) sliderAfterImg.addEventListener('input', (e) => updateAfterPreview(e.target.value));

  // Before Image Upload Setup
  if (beforeDropZone && beforeFileInput) {
    beforeDropZone.addEventListener('click', () => beforeFileInput.click());
    beforeDropZone.addEventListener('dragover', (e) => { e.preventDefault(); beforeDropZone.classList.add('border-blush-400'); });
    beforeDropZone.addEventListener('dragleave', () => beforeDropZone.classList.remove('border-blush-400'));
    beforeDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      beforeDropZone.classList.remove('border-blush-400');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleBeforeFile(file);
    });
    beforeFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleBeforeFile(file);
    });
  }

  async function handleBeforeFile(file) {
    try {
      const compressed = await compressImage(file, 1200, 800, 0.85);
      if (sliderBeforeImg) sliderBeforeImg.value = compressed;
      updateBeforePreview(compressed);
      showToast('Before image optimized & loaded! ✦');
    } catch(err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (sliderBeforeImg) sliderBeforeImg.value = dataUrl;
        updateBeforePreview(dataUrl);
        showToast('Before image loaded from device! ✦');
      };
      reader.readAsDataURL(file);
    }
  }

  // After Image Upload Setup
  if (afterDropZone && afterFileInput) {
    afterDropZone.addEventListener('click', () => afterFileInput.click());
    afterDropZone.addEventListener('dragover', (e) => { e.preventDefault(); afterDropZone.classList.add('border-blush-400'); });
    afterDropZone.addEventListener('dragleave', () => afterDropZone.classList.remove('border-blush-400'));
    afterDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      afterDropZone.classList.remove('border-blush-400');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleAfterFile(file);
    });
    afterFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleAfterFile(file);
    });
  }

  async function handleAfterFile(file) {
    try {
      const compressed = await compressImage(file, 1200, 800, 0.85);
      if (sliderAfterImg) sliderAfterImg.value = compressed;
      updateAfterPreview(compressed);
      showToast('After image optimized & loaded! ✦');
    } catch(err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (sliderAfterImg) sliderAfterImg.value = dataUrl;
        updateAfterPreview(dataUrl);
        showToast('After image loaded from device! ✦');
      };
      reader.readAsDataURL(file);
    }
  }

  function renderSlidersEditor() {
    const config = getStored(KEYS.SLIDERS_CONFIG, DEFAULT_SLIDERS);
    if (baHeadline) baHeadline.value = config.headline || 'BEFORE & AFTER';
    if (baSubtitle) baSubtitle.value = config.subtitle || 'Real transformations. Real confidence.';

    const statSlidersEl = document.getElementById('statTotalSliders');
    if (statSlidersEl) statSlidersEl.textContent = config.sliders.length;

    const sidebarSliderBadge = document.getElementById('sidebarSliderBadge');
    if (sidebarSliderBadge) sidebarSliderBadge.textContent = config.sliders.length;

    if (!slidersListContainer) return;
    slidersListContainer.innerHTML = '';

    config.sliders.forEach((slider, index) => {
      const card = document.createElement('div');
      card.className = 'glass-panel p-6 sm:p-7 rounded-3xl space-y-5 border border-white/10 relative';
      card.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-blush-400">Slider #${index + 1}</span>
            <h4 class="text-xl sm:text-2xl font-condensed-impact text-cream uppercase">${slider.title}</h4>
          </div>
          <div class="flex items-center gap-2">
            <button data-edit-slider="${index}" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
              ✏️ Edit Slider
            </button>
            ${config.sliders.length > 1 ? `
              <button data-delete-slider="${index}" class="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                🗑 Delete
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Live Interactive Mini Slider Preview -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-8">
            <div class="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-espresso select-none shadow-inner comparison-widget">
              <!-- After image -->
              <img src="${slider.afterImg}" alt="After" class="absolute inset-0 w-full h-full object-cover pointer-events-none">
              <span class="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-espresso/80 text-cream text-[10px] font-black uppercase tracking-widest border border-white/20">
                AFTER ✦
              </span>

              <!-- Before image clipped -->
              <div class="comparison-before-layer absolute inset-0 overflow-hidden pointer-events-none" style="width: 50%;">
                <div class="relative w-full h-full" style="width: 200%;">
                  <img src="${slider.beforeImg}" alt="Before" class="absolute inset-0 w-full h-full object-cover">
                </div>
                <span class="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-creamLight/95 text-espresso text-[10px] font-black uppercase tracking-widest border border-blush-300">
                  ✦ BEFORE
                </span>
              </div>

              <!-- Divider -->
              <div class="comparison-divider absolute top-0 bottom-0 pointer-events-none z-20 flex items-center justify-center" style="left: 50%;">
                <div class="w-[3px] h-full bg-cream shadow-[0_0_8px_rgba(0,0,0,0.4)]"></div>
                <div class="absolute w-8 h-8 rounded-full bg-cream border-2 border-blush-400 shadow-xl flex items-center justify-center text-espresso text-[10px] font-black">
                  ◂ ▸
                </div>
              </div>

              <input type="range" min="0" max="100" value="50" class="comparison-range-slider absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30">
            </div>
          </div>

          <div class="lg:col-span-4 space-y-3 text-xs text-cream/70">
            <div class="bg-espressoDark/60 p-3.5 rounded-xl border border-white/5 space-y-1">
              <p class="text-[10px] font-bold uppercase tracking-wider text-cream/40">Before Image Path / Source:</p>
              <p class="font-mono text-[11px] text-cream truncate">${slider.beforeImg.startsWith('data:') ? '[Uploaded Image File]' : slider.beforeImg}</p>
            </div>
            <div class="bg-espressoDark/60 p-3.5 rounded-xl border border-white/5 space-y-1">
              <p class="text-[10px] font-bold uppercase tracking-wider text-cream/40">After Image Path / Source:</p>
              <p class="font-mono text-[11px] text-cream truncate">${slider.afterImg.startsWith('data:') ? '[Uploaded Image File]' : slider.afterImg}</p>
            </div>
            <p class="text-[11px] text-blush-400 flex items-center gap-1.5 pt-1">
              <span>⇄</span> Drag slider handle left/right to test interactive split
            </p>
          </div>
        </div>
      `;
      slidersListContainer.appendChild(card);
    });

    // PROMINENT "ADD ANOTHER SLIDER" ACTION CARD AT BOTTOM OF LIST
    const addCard = document.createElement('div');
    addCard.className = 'border-2 border-dashed border-white/20 hover:border-blush-300 rounded-3xl p-8 text-center cursor-pointer transition-all bg-espressoDark/40 hover:bg-espressoDark/80 group flex flex-col items-center justify-center gap-3';
    addCard.id = 'bottomAddSliderCard';
    addCard.innerHTML = `
      <div class="w-12 h-12 rounded-full bg-blush-300/20 text-blush-300 group-hover:bg-blush-300 group-hover:text-espresso flex items-center justify-center text-xl font-bold transition-all">
        +
      </div>
      <div>
        <h4 class="text-base font-bold text-cream group-hover:text-blush-300 uppercase tracking-wider transition-colors">
          + Add Another Transformation Look
        </h4>
        <p class="text-xs text-cream/50 mt-1">Upload new Before & After pictures to add a 4th, 5th, or subsequent slider</p>
      </div>
    `;
    addCard.addEventListener('click', () => openSliderModal(-1));
    slidersListContainer.appendChild(addCard);

    // Initialize Comparison Sliders inside Admin Dashboard
    initComparisonSliders();

    // Attach Edit Listeners
    document.querySelectorAll('[data-edit-slider]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.editSlider, 10);
        openSliderModal(idx);
      });
    });

    // Attach Delete Listeners
    document.querySelectorAll('[data-delete-slider]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.deleteSlider, 10);
        if (confirm('Are you sure you want to delete this transformation slider?')) {
          const cfg = getStored(KEYS.SLIDERS_CONFIG, DEFAULT_SLIDERS);
          cfg.sliders.splice(idx, 1);
          setStored(KEYS.SLIDERS_CONFIG, cfg);
          showToast('Slider deleted successfully.');
          renderSlidersEditor();
        }
      });
    });
  }

  function initComparisonSliders() {
    document.querySelectorAll('.comparison-widget').forEach((widget) => {
      const slider = widget.querySelector('.comparison-range-slider');
      const beforeLayer = widget.querySelector('.comparison-before-layer');
      const innerWrapper = beforeLayer ? beforeLayer.querySelector('div') : null;
      const divider = widget.querySelector('.comparison-divider');

      if (!slider || !beforeLayer || !divider) return;

      const updatePosition = (val) => {
        beforeLayer.style.width = val + '%';
        divider.style.left = val + '%';
        if (innerWrapper) {
          innerWrapper.style.width = (100 / (val / 100)) + '%';
        }
      };

      updatePosition(slider.value || 50);

      slider.addEventListener('input', (e) => {
        updatePosition(e.target.value);
      });
    });
  }

  function openSliderModal(index = -1) {
    const config = getStored(KEYS.SLIDERS_CONFIG, DEFAULT_SLIDERS);
    const modalTitle = document.getElementById('sliderModalTitle');
    const idxInput = document.getElementById('sliderIndex');
    const titleInput = document.getElementById('sliderTitle');
    const beforeInput = document.getElementById('sliderBeforeImg');
    const afterInput = document.getElementById('sliderAfterImg');

    if (beforeFileInput) beforeFileInput.value = '';
    if (afterFileInput) afterFileInput.value = '';

    if (index >= 0 && config.sliders[index]) {
      const s = config.sliders[index];
      if (modalTitle) modalTitle.textContent = `Edit Slider #${index + 1}`;
      if (idxInput) idxInput.value = index;
      if (titleInput) titleInput.value = s.title;
      if (beforeInput) beforeInput.value = s.beforeImg;
      if (afterInput) afterInput.value = s.afterImg;
      updateBeforePreview(s.beforeImg);
      updateAfterPreview(s.afterImg);
    } else {
      const nextNum = String(config.sliders.length + 1).padStart(2, '0');
      if (modalTitle) modalTitle.textContent = `Add Transformation Slider #${nextNum}`;
      if (idxInput) idxInput.value = -1;
      if (sliderForm) sliderForm.reset();
      if (titleInput) titleInput.value = `${nextNum} / New Transformation Look`;
      updateBeforePreview('');
      updateAfterPreview('');
    }

    if (sliderModal) {
      sliderModal.classList.remove('hidden');
      sliderModal.classList.add('flex');
    }
  }

  function closeSliderModal() {
    if (sliderModal) {
      sliderModal.classList.add('hidden');
      sliderModal.classList.remove('flex');
    }
  }

  if (addSliderBtn) addSliderBtn.addEventListener('click', () => openSliderModal(-1));
  
  const heroAddSliderBtn = document.getElementById('heroAddSliderBtn');
  if (heroAddSliderBtn) heroAddSliderBtn.addEventListener('click', () => openSliderModal(-1));

  const topNavAddSliderBtn = document.getElementById('topNavAddSliderBtn');
  if (topNavAddSliderBtn) topNavAddSliderBtn.addEventListener('click', () => openSliderModal(-1));

  const overviewAddSliderBtn = document.getElementById('overviewAddSliderBtn');
  if (overviewAddSliderBtn) overviewAddSliderBtn.addEventListener('click', () => openSliderModal(-1));

  const overviewBannerAddSliderBtn = document.getElementById('overviewBannerAddSliderBtn');
  if (overviewBannerAddSliderBtn) overviewBannerAddSliderBtn.addEventListener('click', () => openSliderModal(-1));

  const statCardAddSliderBtn = document.getElementById('statCardAddSliderBtn');
  if (statCardAddSliderBtn) statCardAddSliderBtn.addEventListener('click', () => openSliderModal(-1));

  const overviewBannerAddServiceBtn = document.getElementById('overviewBannerAddServiceBtn');
  if (overviewBannerAddServiceBtn) overviewBannerAddServiceBtn.addEventListener('click', () => openServiceModal(-1));

  if (closeSliderModalBtn) closeSliderModalBtn.addEventListener('click', closeSliderModal);
  if (cancelSliderModalBtn) cancelSliderModalBtn.addEventListener('click', closeSliderModal);

  if (sliderForm) {
    sliderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const idx = parseInt(document.getElementById('sliderIndex').value, 10);
      const title = document.getElementById('sliderTitle').value.trim();
      const beforeImg = document.getElementById('sliderBeforeImg').value.trim();
      const afterImg = document.getElementById('sliderAfterImg').value.trim();

      if (!beforeImg || !afterImg) {
        showToast('Please upload or provide both Before and After images.', 'error');
        return;
      }

      const config = getStored(KEYS.SLIDERS_CONFIG, DEFAULT_SLIDERS);
      if (idx >= 0) {
        config.sliders[idx] = { ...config.sliders[idx], title, beforeImg, afterImg };
        showToast(`Slider "${title}" updated! ✦`);
      } else {
        const num = String(config.sliders.length + 1).padStart(2, '0');
        config.sliders.push({
          id: 'look-' + Date.now(),
          lookNumber: num,
          title: title,
          subtitle: `Look ${num} of ${String(config.sliders.length + 1).padStart(2, '0')}`,
          beforeImg: beforeImg,
          afterImg: afterImg
        });
        showToast(`New transformation slider "${title}" added! ✦`);
      }

      setStored(KEYS.SLIDERS_CONFIG, config);
      closeSliderModal();
      renderSlidersEditor();
    });
  }

  if (saveBaHeadingsBtn) {
    saveBaHeadingsBtn.addEventListener('click', () => {
      const config = getStored(KEYS.SLIDERS_CONFIG, DEFAULT_SLIDERS);
      config.headline = baHeadline.value.trim() || 'BEFORE & AFTER';
      config.subtitle = baSubtitle.value.trim() || 'Real transformations. Real confidence.';
      setStored(KEYS.SLIDERS_CONFIG, config);
      showToast('Transformation section headers saved! ✦');
    });
  }


  // =========================================================================
  // 8. WORKING HOURS, CAPACITY & AVAILABILITY CONTROLLER
  // =========================================================================
  const openingTimeSelect = document.getElementById('openingTimeSelect');
  const closingTimeSelect = document.getElementById('closingTimeSelect');
  const slotIntervalSelect = document.getElementById('slotIntervalSelect');
  const slotCapacitySelect = document.getElementById('slotCapacitySelect');
  const saveHoursBtn = document.getElementById('saveHoursBtn');

  // Slot Manager Elements
  const slotManagerDateInput = document.getElementById('slotManagerDateInput');
  const slotDateTodayBtn = document.getElementById('slotDateTodayBtn');
  const slotDateTomorrowBtn = document.getElementById('slotDateTomorrowBtn');
  const slotSummaryText = document.getElementById('slotSummaryText');
  const slotManagerGrid = document.getElementById('slotManagerGrid');
  const unblockAllSlotsBtn = document.getElementById('unblockAllSlotsBtn');
  const blockAllSlotsBtn = document.getElementById('blockAllSlotsBtn');

  // Recurring Breaks Elements
  const newBreakStart = document.getElementById('newBreakStart');
  const newBreakEnd = document.getElementById('newBreakEnd');
  const newBreakReason = document.getElementById('newBreakReason');
  const addRecurringBreakBtn = document.getElementById('addRecurringBreakBtn');
  const recurringBreaksContainer = document.getElementById('recurringBreaksContainer');

  // Blocked Dates Elements
  const newBlockedDateInput = document.getElementById('newBlockedDateInput');
  const newBlockedDateReason = document.getElementById('newBlockedDateReason');
  const addBlockedDateBtn = document.getElementById('addBlockedDateBtn');
  const blockedDatesContainer = document.getElementById('blockedDatesContainer');

  // Helper date strings
  function getFormattedToday() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function getFormattedTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Initialize date picker default
  if (slotManagerDateInput) {
    const todayStr = getFormattedToday();
    slotManagerDateInput.value = todayStr;
    slotManagerDateInput.min = todayStr;
    slotManagerDateInput.addEventListener('change', () => renderSlotManagerGrid());
  }

  if (slotDateTodayBtn) {
    slotDateTodayBtn.addEventListener('click', () => {
      if (slotManagerDateInput) {
        slotManagerDateInput.value = getFormattedToday();
        renderSlotManagerGrid();
      }
    });
  }

  if (slotDateTomorrowBtn) {
    slotDateTomorrowBtn.addEventListener('click', () => {
      if (slotManagerDateInput) {
        slotManagerDateInput.value = getFormattedTomorrow();
        renderSlotManagerGrid();
      }
    });
  }

  function renderScheduleEditor() {
    const config = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
    if (openingTimeSelect) openingTimeSelect.value = config.openingTime || '10:30';
    if (closingTimeSelect) closingTimeSelect.value = config.closingTime || '20:30';
    if (slotIntervalSelect) slotIntervalSelect.value = config.slotInterval || '30';
    if (slotCapacitySelect) slotCapacitySelect.value = config.slotCapacity || '2';

    renderSlotManagerGrid();
    renderRecurringBreaksList();
    renderBlockedDatesList();
  }

  // Generate Slots Array from config
  function generateSlotsList(config) {
    const [openHour, openMin] = (config.openingTime || '10:30').split(':').map(Number);
    const [closeHour, closeMin] = (config.closingTime || '20:30').split(':').map(Number);
    const interval = parseInt(config.slotInterval || '30', 10);

    const slots = [];
    let curMins = openHour * 60 + openMin;
    const endMins = closeHour * 60 + closeMin;

    while (curMins < endMins) {
      const h = Math.floor(curMins / 60);
      const m = curMins % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = String(m).padStart(2, '0');
      slots.push({
        id: `${String(h).padStart(2, '0')}:${displayM}`,
        display: `${displayH}:${displayM} ${period}`,
        hour: h,
        min: m,
        totalMin: curMins
      });
      curMins += interval;
    }
    return slots;
  }

  // Interactive Slot Manager Grid
  function renderSlotManagerGrid() {
    if (!slotManagerGrid) return;
    const config = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
    const selectedDate = slotManagerDateInput ? slotManagerDateInput.value : getFormattedToday();
    const allBookings = getBookings();
    const capacity = parseInt(config.slotCapacity || '2', 10);
    const blockedDates = config.blockedDates || [];
    const recurringBreaks = config.recurringBlockedHours || [];
    const dateBlockedMap = config.dateBlockedSlots || {};
    const explicitlyBlocked = dateBlockedMap[selectedDate] || [];

    const isDateBlocked = blockedDates.find(b => b.date === selectedDate);
    const slots = generateSlotsList(config);

    slotManagerGrid.innerHTML = '';

    let openCount = 0;
    let blockedCount = 0;
    let bookedCount = 0;
    let breakCount = 0;

    slots.forEach(slot => {
      // 1. Check Recurring Break
      const inRecurringBreak = recurringBreaks.find(brk => {
        const [bStartH, bStartM] = brk.startTime.split(':').map(Number);
        const [bEndH, bEndM] = brk.endTime.split(':').map(Number);
        const startMin = bStartH * 60 + bStartM;
        const endMin = bEndH * 60 + bEndM;
        return slot.totalMin >= startMin && slot.totalMin < endMin;
      });

      // 2. Check Customer Bookings for this Date + Time
      const slotBookings = allBookings.filter(b => b.date === selectedDate && b.time === slot.display && b.status !== 'cancelled');
      const numBooked = slotBookings.length;
      const isFull = numBooked >= capacity;

      // 3. Check Manual Override
      const isManualBlocked = explicitlyBlocked.includes(slot.id);

      // Determine State
      let state = 'open'; // 'open', 'blocked', 'break', 'full', 'partial', 'date-closed'
      let statusText = `${capacity}/${capacity} Spots Open`;
      let chipClass = '';

      if (isDateBlocked) {
        state = 'date-closed';
        statusText = 'Salon Closed';
        chipClass = 'bg-rose-950/40 border-rose-800/40 text-rose-300/60 cursor-not-allowed opacity-60';
        blockedCount++;
      } else if (inRecurringBreak) {
        state = 'break';
        statusText = `Break: ${inRecurringBreak.reason || 'Staff'}`;
        chipClass = 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-400 cursor-pointer';
        breakCount++;
      } else if (isManualBlocked) {
        state = 'blocked';
        statusText = '🚫 Blocked';
        chipClass = 'bg-rose-950/60 border-rose-500/60 text-rose-200 hover:border-rose-400 cursor-pointer shadow-inner';
        blockedCount++;
      } else if (isFull) {
        state = 'full';
        const clientNames = slotBookings.map(b => b.fullName).join(', ');
        statusText = `🟣 Fully Booked: ${numBooked}/${capacity}`;
        chipClass = 'bg-purple-950/60 border-purple-500/60 text-purple-200 hover:border-purple-400 cursor-pointer';
        bookedCount++;
      } else if (numBooked > 0) {
        state = 'partial';
        const remaining = capacity - numBooked;
        statusText = `🟡 ${remaining} of ${capacity} Open`;
        chipClass = 'bg-emerald-950/50 border-amber-400/60 text-cream hover:border-amber-400 cursor-pointer';
        openCount++;
      } else {
        state = 'open';
        statusText = `🟢 ${capacity}/${capacity} Open`;
        chipClass = 'bg-espressoDark/90 border-emerald-500/30 text-cream hover:border-emerald-400 cursor-pointer hover:bg-emerald-950/30';
        openCount++;
      }

      const card = document.createElement('div');
      card.className = `p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none relative group ${chipClass}`;
      
      const clientTooltip = slotBookings.length > 0 
        ? `Clients: ${slotBookings.map(b => b.fullName + ' - ' + b.service).join(' | ')}`
        : '';

      card.title = isDateBlocked 
        ? `Salon is closed on this date: ${isDateBlocked.reason || 'Holiday'}`
        : inRecurringBreak
          ? `Recurring Daily Break: ${inRecurringBreak.reason}`
          : clientTooltip || (isManualBlocked ? 'Click to UNBLOCK this slot' : 'Click to BLOCK this slot');

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-sm text-cream font-mono">${slot.display}</span>
          <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
            state === 'open' ? 'bg-emerald-500/20 text-emerald-300' :
            state === 'partial' ? 'bg-amber-500/20 text-amber-300' :
            state === 'blocked' ? 'bg-rose-500/20 text-rose-300' :
            state === 'break' ? 'bg-amber-500/20 text-amber-300' :
            state === 'full' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-cream/40'
          }">
            ${state === 'open' ? 'Open' : state === 'partial' ? '1 Open' : state === 'blocked' ? 'Blocked' : state === 'break' ? 'Break' : state === 'full' ? 'Full' : 'Closed'}
          </span>
        </div>
        <div class="text-[11px] text-cream/70 mt-2 truncate">
          ${statusText}
        </div>
        ${slotBookings.length > 0 ? `
          <div class="text-[10px] text-blush-300 truncate mt-0.5 font-medium">
            👤 ${slotBookings[0].fullName}${slotBookings.length > 1 ? ` +${slotBookings.length - 1}` : ''}
          </div>
        ` : ''}
      `;

      // Click to Toggle Slot Block
      if (!isDateBlocked) {
        card.addEventListener('click', () => {
          const cfg = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
          if (!cfg.dateBlockedSlots) cfg.dateBlockedSlots = {};
          if (!cfg.dateBlockedSlots[selectedDate]) cfg.dateBlockedSlots[selectedDate] = [];

          const list = cfg.dateBlockedSlots[selectedDate];
          const existsIdx = list.indexOf(slot.id);

          if (existsIdx >= 0) {
            // Unblock
            list.splice(existsIdx, 1);
            showToast(`Slot ${slot.display} opened for ${selectedDate} ✦`);
          } else {
            // Block
            list.push(slot.id);
            showToast(`Slot ${slot.display} blocked for ${selectedDate} ✕`);
          }

          setStored(KEYS.SCHEDULE_CONFIG, cfg);
          renderSlotManagerGrid();
        });
      }

      slotManagerGrid.appendChild(card);
    });

    // Update Summary Header
    if (slotSummaryText) {
      if (isDateBlocked) {
        slotSummaryText.innerHTML = `<span class="text-rose-400">Salon Closed: ${isDateBlocked.reason || 'Off-day'}</span> — 0 slots open on ${selectedDate}`;
      } else {
        slotSummaryText.innerHTML = `<span class="text-emerald-400">${openCount} of ${slots.length} Slots Open</span> on ${selectedDate} • <span class="text-cream/50 font-normal">${blockedCount} blocked, ${bookedCount} booked, ${breakCount} breaks</span>`;
      }
    }
  }

  // Quick Action: Open All Slots on selected date
  if (unblockAllSlotsBtn) {
    unblockAllSlotsBtn.addEventListener('click', () => {
      const selectedDate = slotManagerDateInput ? slotManagerDateInput.value : getFormattedToday();
      const cfg = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
      if (cfg.dateBlockedSlots && cfg.dateBlockedSlots[selectedDate]) {
        delete cfg.dateBlockedSlots[selectedDate];
        setStored(KEYS.SCHEDULE_CONFIG, cfg);
        showToast(`All slots opened for ${selectedDate} ✦`);
        renderSlotManagerGrid();
      } else {
        showToast(`All slots are already open for ${selectedDate}.`);
      }
    });
  }

  // Quick Action: Block All Slots on selected date
  if (blockAllSlotsBtn) {
    blockAllSlotsBtn.addEventListener('click', () => {
      const selectedDate = slotManagerDateInput ? slotManagerDateInput.value : getFormattedToday();
      const cfg = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
      if (!cfg.dateBlockedSlots) cfg.dateBlockedSlots = {};
      const slots = generateSlotsList(cfg);
      cfg.dateBlockedSlots[selectedDate] = slots.map(s => s.id);
      setStored(KEYS.SCHEDULE_CONFIG, cfg);
      showToast(`All slots blocked for ${selectedDate} ✕`);
      renderSlotManagerGrid();
    });
  }

  // Recurring Breaks List
  function renderRecurringBreaksList() {
    if (!recurringBreaksContainer) return;
    const config = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
    const breaks = config.recurringBlockedHours || [];

    recurringBreaksContainer.innerHTML = '';
    if (breaks.length === 0) {
      recurringBreaksContainer.innerHTML = '<p class="text-xs text-cream/40 col-span-full py-2">No recurring daily breaks added.</p>';
      return;
    }

    breaks.forEach((b, index) => {
      const pill = document.createElement('div');
      pill.className = 'p-3.5 rounded-2xl bg-espressoDark/90 border border-white/10 flex items-center justify-between gap-3 text-xs';
      
      const formatTimePeriod = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
      };

      pill.innerHTML = `
        <div>
          <div class="font-bold text-cream font-mono">${formatTimePeriod(b.startTime)} – ${formatTimePeriod(b.endTime)}</div>
          <div class="text-[11px] text-amber-400">${b.reason || 'Staff Break'} • Daily</div>
        </div>
        <button data-remove-break="${index}" class="w-7 h-7 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 flex items-center justify-center text-xs font-bold transition-all cursor-pointer" title="Remove Break">
          ✕
        </button>
      `;
      recurringBreaksContainer.appendChild(pill);
    });

    document.querySelectorAll('[data-remove-break]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.removeBreak, 10);
        const cfg = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
        cfg.recurringBlockedHours.splice(idx, 1);
        setStored(KEYS.SCHEDULE_CONFIG, cfg);
        showToast('Recurring daily break removed.');
        renderRecurringBreaksList();
        renderSlotManagerGrid();
      });
    });
  }

  // Add Recurring Break
  if (addRecurringBreakBtn && newBreakStart && newBreakEnd) {
    addRecurringBreakBtn.addEventListener('click', () => {
      const startTime = newBreakStart.value;
      const endTime = newBreakEnd.value;
      const reason = newBreakReason ? newBreakReason.value.trim() : 'Staff Break';

      if (!startTime || !endTime) {
        showToast('Please select both start and end times for the break.', 'error');
        return;
      }
      if (startTime >= endTime) {
        showToast('Start time must be before end time.', 'error');
        return;
      }

      const config = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
      if (!config.recurringBlockedHours) config.recurringBlockedHours = [];
      config.recurringBlockedHours.push({
        id: 'break-' + Date.now(),
        startTime,
        endTime,
        reason: reason || 'Staff Break'
      });

      setStored(KEYS.SCHEDULE_CONFIG, config);
      showToast(`Recurring break "${reason}" added! ✦`);
      renderRecurringBreaksList();
      renderSlotManagerGrid();
    });
  }

  // Blocked Dates List
  function renderBlockedDatesList() {
    if (!blockedDatesContainer) return;
    const config = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
    const blocked = config.blockedDates || [];

    blockedDatesContainer.innerHTML = '';
    if (blocked.length === 0) {
      blockedDatesContainer.innerHTML = '<p class="text-xs text-cream/40 col-span-full py-2">No blocked dates currently added.</p>';
      return;
    }

    blocked.forEach((item, index) => {
      const pill = document.createElement('div');
      pill.className = 'p-3.5 rounded-2xl bg-espressoDark/90 border border-white/10 flex items-center justify-between gap-3 text-xs';
      pill.innerHTML = `
        <div>
          <div class="font-bold text-cream font-mono">${item.date}</div>
          <div class="text-[11px] text-blush-400">${item.reason || 'Blocked date'}</div>
        </div>
        <button data-remove-blocked="${index}" class="w-7 h-7 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 flex items-center justify-center text-xs font-bold transition-all cursor-pointer" title="Unblock Date">
          ✕
        </button>
      `;
      blockedDatesContainer.appendChild(pill);
    });

    document.querySelectorAll('[data-remove-blocked]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.removeBlocked, 10);
        const cfg = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
        cfg.blockedDates.splice(idx, 1);
        setStored(KEYS.SCHEDULE_CONFIG, cfg);
        showToast('Date unblocked and restored for booking.');
        renderBlockedDatesList();
        renderSlotManagerGrid();
      });
    });
  }

  if (saveHoursBtn) {
    saveHoursBtn.addEventListener('click', () => {
      const config = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
      config.openingTime = openingTimeSelect.value;
      config.closingTime = closingTimeSelect.value;
      config.slotInterval = slotIntervalSelect.value;
      if (slotCapacitySelect) config.slotCapacity = slotCapacitySelect.value;
      setStored(KEYS.SCHEDULE_CONFIG, config);
      showToast('Salon operating hours & capacity saved! Synced with booking form ✦');
      renderSlotManagerGrid();
    });
  }

  if (addBlockedDateBtn && newBlockedDateInput) {
    addBlockedDateBtn.addEventListener('click', () => {
      const dateVal = newBlockedDateInput.value;
      const reasonVal = newBlockedDateReason ? newBlockedDateReason.value.trim() : 'Blocked Date';
      if (!dateVal) {
        showToast('Please select a date to block.', 'error');
        return;
      }
      const config = getStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
      if (!config.blockedDates) config.blockedDates = [];
      if (config.blockedDates.some(b => b.date === dateVal)) {
        showToast('This date is already blocked.', 'error');
        return;
      }
      config.blockedDates.push({ date: dateVal, reason: reasonVal });
      setStored(KEYS.SCHEDULE_CONFIG, config);
      newBlockedDateInput.value = '';
      if (newBlockedDateReason) newBlockedDateReason.value = '';
      showToast(`Date ${dateVal} blocked successfully.`);
      renderBlockedDatesList();
      renderSlotManagerGrid();
    });
  }


  // =========================================================================
  // 9. SECURITY & CREDENTIALS CONTROLLER
  // =========================================================================
  const updateCredentialsForm = document.getElementById('updateCredentialsForm');
  const updateEmailInput = document.getElementById('updateEmailInput');
  const updatePasswordInput = document.getElementById('updatePasswordInput');
  const updateConfirmPasswordInput = document.getElementById('updateConfirmPasswordInput');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

  function renderSecurityTab() {
    const auth = getStored(KEYS.AUTH, DEFAULT_AUTH);
    if (updateEmailInput) updateEmailInput.value = auth.email;
    if (updatePasswordInput) updatePasswordInput.value = '';
    if (updateConfirmPasswordInput) updateConfirmPasswordInput.value = '';
  }

  if (updateCredentialsForm) {
    updateCredentialsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newEmail = updateEmailInput.value.trim();
      const newPassword = updatePasswordInput.value.trim();
      const confirmPassword = updateConfirmPasswordInput.value.trim();

      if (!newEmail) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('Passwords do not match. Please re-enter.', 'error');
        return;
      }
      if (newPassword.length < 6) {
        showToast('Password should be at least 6 characters.', 'error');
        return;
      }

      setStored(KEYS.AUTH, { email: newEmail, password: newPassword });
      setStored(KEYS.SESSION, { isLoggedIn: true, email: newEmail, loggedAt: new Date().toISOString() });
      showToast('Admin email and password updated successfully! ✦');
      renderSecurityTab();
    });
  }

  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data (Services, Sliders, Stylists, Hours, Sample Bookings) back to factory defaults?')) {
        setStored(KEYS.AUTH, DEFAULT_AUTH);
        setStored(KEYS.SERVICES_CONFIG, DEFAULT_SERVICES);
        setStored(KEYS.SLIDERS_CONFIG, DEFAULT_SLIDERS);
        setStored(KEYS.SCHEDULE_CONFIG, DEFAULT_SCHEDULE);
        setStored(KEYS.STYLISTS_CONFIG, DEFAULT_STYLISTS);
        setStored(KEYS.BOOKINGS, SAMPLE_BOOKINGS);
        showToast('All settings reset to defaults.');
        refreshAllData();
      }
    });
  }


  // =========================================================================
  // 10. STYLISTS & TEAM MANAGEMENT CONTROLLER
  // =========================================================================
  const addStylistBtn = document.getElementById('addStylistBtn');
  const stylistModal = document.getElementById('stylistModal');
  const closeStylistModalBtn = document.getElementById('closeStylistModalBtn');
  const cancelStylistModalBtn = document.getElementById('cancelStylistModalBtn');
  const stylistForm = document.getElementById('stylistForm');
  const stylistModalTitle = document.getElementById('stylistModalTitle');
  const stylistIdInput = document.getElementById('stylistId');
  const stylistNameInput = document.getElementById('stylistName');
  const stylistRoleInput = document.getElementById('stylistRole');
  const stylistSpecialtyInput = document.getElementById('stylistSpecialty');
  const stylistExperienceInput = document.getElementById('stylistExperience');
  const stylistAvatarInput = document.getElementById('stylistAvatar');
  const stylistFileInput = document.getElementById('stylistFileInput');
  const stylistDropZone = document.getElementById('stylistDropZone');
  const stylistPreviewContainer = document.getElementById('stylistPreviewContainer');
  const stylistPreviewImg = document.getElementById('stylistPreviewImg');
  const stylistPreviewName = document.getElementById('stylistPreviewName');
  const stylistPreviewRole = document.getElementById('stylistPreviewRole');
  const stylistActiveCheckbox = document.getElementById('stylistActiveCheckbox');

  function getStylists() {
    return getStored(KEYS.STYLISTS_CONFIG, DEFAULT_STYLISTS);
  }

  function setStylists(list) {
    return setStored(KEYS.STYLISTS_CONFIG, list);
  }

  function renderStylistsEditor() {
    const stylists = getStylists();
    const container = document.getElementById('stylistsGridContainer');
    const noMsg = document.getElementById('noStylistsMsg');
    const sidebarBadge = document.getElementById('sidebarStylistsBadge');
    const activeBadge = document.getElementById('stylistsActiveCountBadge');
    const manualStylistSelect = document.getElementById('manualStylist');

    const activeCount = stylists.filter(s => s.active !== false).length;
    if (sidebarBadge) sidebarBadge.textContent = activeCount;
    if (activeBadge) activeBadge.textContent = `${activeCount} Active`;

    // Populate manual booking stylist dropdown
    if (manualStylistSelect) {
      const currentVal = manualStylistSelect.value;
      manualStylistSelect.innerHTML = '<option value="Any Available Stylist">Any Available Stylist (First Available)</option>';
      stylists.filter(s => s.active !== false).forEach(s => {
        const opt = document.createElement('option');
        opt.value = `${s.name} – ${s.role}`;
        opt.textContent = `${s.name} – ${s.role} (${s.specialty})`;
        manualStylistSelect.appendChild(opt);
      });
      if (currentVal) manualStylistSelect.value = currentVal;
    }

    if (!container) return;

    if (stylists.length === 0) {
      container.innerHTML = '';
      if (noMsg) noMsg.classList.remove('hidden');
      return;
    }

    if (noMsg) noMsg.classList.add('hidden');
    container.innerHTML = '';

    stylists.forEach((s) => {
      const card = document.createElement('div');
      const isActive = s.active !== false;
      card.className = `glass-panel p-6 rounded-3xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
        isActive ? 'border-white/15 hover:border-blush-300/40' : 'opacity-65 border-white/5'
      }`;

      const avatarSrc = s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

      card.innerHTML = `
        <div>
          <!-- Header with Avatar, Name, Role & Status -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3.5">
              <div class="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-blush-300/40 bg-espresso flex-shrink-0 shadow-md">
                <img src="${avatarSrc}" alt="${s.name}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent pointer-events-none"></div>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-cream tracking-wide">${s.name}</h3>
                </div>
                <p class="text-xs font-semibold text-blush-300 uppercase tracking-wider mt-0.5">${s.role}</p>
                ${s.experience ? `<span class="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-cream/70">${s.experience}</span>` : ''}
              </div>
            </div>

            <!-- Active / Inactive Status Badge (Clickable) -->
            <button data-toggle-stylist="${s.id}" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isActive 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30' 
                : 'bg-white/10 text-cream/50 border border-white/10 hover:bg-white/20'
            }" title="Click to toggle active status for booking form">
              ${isActive ? '● Active' : '○ Inactive'}
            </button>
          </div>

          <!-- Specialty Box -->
          <div class="p-3.5 rounded-2xl bg-espressoDark/60 border border-white/5 mb-4">
            <span class="text-[10px] uppercase font-bold tracking-widest text-cream/40 block mb-1">Specialty &amp; Expertise</span>
            <p class="text-xs font-medium text-cream/90 leading-relaxed">${s.specialty}</p>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
          <span class="text-[11px] text-cream/40">
            ${isActive ? '✓ Appears on booking form' : '✕ Hidden from bookings'}
          </span>
          <div class="flex items-center gap-1.5">
            <button data-edit-stylist="${s.id}" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
              Edit
            </button>
            <button data-delete-stylist="${s.id}" class="px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold transition-all cursor-pointer" title="Delete Stylist">
              🗑️
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Wire up Toggle Active Buttons
    container.querySelectorAll('[data-toggle-stylist]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.toggleStylist;
        const list = getStylists();
        const stylist = list.find(x => x.id === id);
        if (stylist) {
          stylist.active = stylist.active === false ? true : false;
          setStylists(list);
          showToast(`Stylist ${stylist.name} is now ${stylist.active ? 'ACTIVE (visible in booking form)' : 'INACTIVE (hidden)'}.`);
          renderStylistsEditor();
        }
      });
    });

    // Wire up Edit Buttons
    container.querySelectorAll('[data-edit-stylist]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.editStylist;
        openStylistModal(id);
      });
    });

    // Wire up Delete Buttons
    container.querySelectorAll('[data-delete-stylist]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.deleteStylist;
        const list = getStylists();
        const stylist = list.find(x => x.id === id);
        if (stylist && confirm(`Are you sure you want to delete stylist "${stylist.name}"?`)) {
          const updated = list.filter(x => x.id !== id);
          setStylists(updated);
          showToast(`Stylist ${stylist.name} removed successfully.`);
          renderStylistsEditor();
        }
      });
    });
  }

  function openStylistModal(stylistId = null) {
    if (!stylistModal) return;
    const isEdit = Boolean(stylistId);
    stylistModalTitle.textContent = isEdit ? 'Edit Stylist Profile' : 'Add New Stylist';
    stylistIdInput.value = stylistId || '';

    if (isEdit) {
      const list = getStylists();
      const stylist = list.find(x => x.id === stylistId);
      if (stylist) {
        stylistNameInput.value = stylist.name || '';
        stylistRoleInput.value = stylist.role || '';
        stylistSpecialtyInput.value = stylist.specialty || '';
        stylistExperienceInput.value = stylist.experience || '';
        stylistAvatarInput.value = stylist.avatar || '';
        stylistActiveCheckbox.checked = stylist.active !== false;

        if (stylist.avatar) {
          stylistPreviewImg.src = stylist.avatar;
          stylistPreviewName.textContent = stylist.name || 'Stylist Name';
          stylistPreviewRole.textContent = stylist.role || 'Stylist Role';
          stylistPreviewContainer.classList.remove('hidden');
        } else {
          stylistPreviewContainer.classList.add('hidden');
        }
      }
    } else {
      stylistForm.reset();
      stylistIdInput.value = '';
      stylistActiveCheckbox.checked = true;
      stylistPreviewContainer.classList.add('hidden');
    }

    stylistModal.classList.remove('hidden');
    stylistModal.classList.add('flex');
    if (stylistNameInput) stylistNameInput.focus();
  }

  function closeStylistModal() {
    if (!stylistModal) return;
    stylistModal.classList.add('hidden');
    stylistModal.classList.remove('flex');
  }

  function initStylistsManager() {
    if (addStylistBtn) {
      addStylistBtn.addEventListener('click', () => openStylistModal(null));
    }
    if (closeStylistModalBtn) {
      closeStylistModalBtn.addEventListener('click', closeStylistModal);
    }
    if (cancelStylistModalBtn) {
      cancelStylistModalBtn.addEventListener('click', closeStylistModal);
    }
    if (stylistModal) {
      stylistModal.addEventListener('click', (e) => {
        if (e.target === stylistModal) closeStylistModal();
      });
    }

    // Avatar upload dropzone & file input
    if (stylistDropZone && stylistFileInput) {
      stylistDropZone.addEventListener('click', () => stylistFileInput.click());
      stylistDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        stylistDropZone.classList.add('border-blush-300', 'bg-espressoDark/90');
      });
      stylistDropZone.addEventListener('dragleave', () => {
        stylistDropZone.classList.remove('border-blush-300', 'bg-espressoDark/90');
      });
      stylistDropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        stylistDropZone.classList.remove('border-blush-300', 'bg-espressoDark/90');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          const compressed = await compressImage(file, 600, 600, 0.88);
          stylistAvatarInput.value = compressed;
          stylistPreviewImg.src = compressed;
          stylistPreviewName.textContent = stylistNameInput.value || 'Stylist Name';
          stylistPreviewRole.textContent = stylistRoleInput.value || 'Stylist Role';
          stylistPreviewContainer.classList.remove('hidden');
          showToast('Stylist photo uploaded & optimized ✦');
        }
      });

      stylistFileInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const compressed = await compressImage(file, 600, 600, 0.88);
          stylistAvatarInput.value = compressed;
          stylistPreviewImg.src = compressed;
          stylistPreviewName.textContent = stylistNameInput.value || 'Stylist Name';
          stylistPreviewRole.textContent = stylistRoleInput.value || 'Stylist Role';
          stylistPreviewContainer.classList.remove('hidden');
          showToast('Stylist photo uploaded & optimized ✦');
        }
      });
    }

    // URL input live preview
    if (stylistAvatarInput) {
      stylistAvatarInput.addEventListener('input', () => {
        const val = stylistAvatarInput.value.trim();
        if (val) {
          stylistPreviewImg.src = val;
          stylistPreviewName.textContent = stylistNameInput.value || 'Stylist Name';
          stylistPreviewRole.textContent = stylistRoleInput.value || 'Stylist Role';
          stylistPreviewContainer.classList.remove('hidden');
        } else {
          stylistPreviewContainer.classList.add('hidden');
        }
      });
    }

    // Form submit
    if (stylistForm) {
      stylistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = stylistIdInput.value;
        const name = stylistNameInput.value.trim();
        const role = stylistRoleInput.value.trim();
        const specialty = stylistSpecialtyInput.value.trim();
        const experience = stylistExperienceInput.value.trim();
        const avatar = stylistAvatarInput.value.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        const active = stylistActiveCheckbox.checked;

        if (!name || !role || !specialty) {
          showToast('Please fill in Stylist Name, Role and Specialty.', 'error');
          return;
        }

        let list = getStylists();
        if (id) {
          // Update existing
          const idx = list.findIndex(x => x.id === id);
          if (idx !== -1) {
            list[idx] = { ...list[idx], name, role, specialty, experience, avatar, active };
            showToast(`Stylist ${name} updated successfully! ✦`);
          }
        } else {
          // Add new
          const newStylist = {
            id: 'stylist-' + Date.now().toString(36),
            name,
            role,
            specialty,
            experience,
            avatar,
            active
          };
          list.push(newStylist);
          showToast(`Stylist ${name} added to salon directory! ✦`);
        }

        setStylists(list);
        closeStylistModal();
        renderStylistsEditor();
      });
    }
  }


  // =========================================================================
  // 11. SUPABASE CLOUD LIVE SYNC & REALTIME SUBSCRIPTION
  // =========================================================================
  let supabaseSyncInitialized = false;

  function initSupabaseSync() {
    if (supabaseSyncInitialized) return;
    if (window.JTSupabase && typeof window.JTSupabase.fetchBookings === 'function') {
      supabaseSyncInitialized = true;

      // 1. Initial Remote Fetch from Supabase
      window.JTSupabase.fetchBookings().then(remoteBookings => {
        if (remoteBookings && remoteBookings.length > 0) {
          setStored(KEYS.BOOKINGS, remoteBookings);
          renderBookings();
          console.log(`[Admin] Loaded ${remoteBookings.length} bookings from Supabase`);
        }
      }).catch(err => console.error('[Admin] Supabase initial fetch error:', err));

      // 2. Realtime Postgres Changes Subscription
      window.JTSupabase.subscribeToBookings(
        // On Insert
        (inserted) => {
          let list = getBookings();
          const exists = list.some(x => x.id === inserted.id);
          if (!exists) {
            list.push(inserted);
            setStored(KEYS.BOOKINGS, list);
            renderBookings();
            showToast(`✦ New Booking Received: ${inserted.fullName} (${inserted.service})!`);
          }
        },
        // On Update
        (updated) => {
          let list = getBookings();
          const idx = list.findIndex(x => x.id === updated.id);
          if (idx !== -1) {
            list[idx] = updated;
            setStored(KEYS.BOOKINGS, list);
            renderBookings();
          }
        },
        // On Delete
        (deletedId) => {
          let list = getBookings();
          list = list.filter(x => x.id !== deletedId);
          setStored(KEYS.BOOKINGS, list);
          renderBookings();
        }
      );
    }
  }

  // =========================================================================
  // 12. REFRESH ALL VIEWS & CROSS-TAB STORAGE SYNC
  // =========================================================================
  function refreshAllData() {
    renderBookings();
    renderServicesEditor();
    renderSlidersEditor();
    renderStylistsEditor();
    renderScheduleEditor();
    renderSecurityTab();
    initSupabaseSync();
  }

  window.addEventListener('storage', () => {
    refreshAllData();
  });

  // Initialize Stylist Manager event listeners
  initStylistsManager();

  // Run initial session check on boot
  checkSession();
  initSupabaseSync();

});
