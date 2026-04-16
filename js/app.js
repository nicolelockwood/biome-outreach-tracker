import { renderSignIn } from './screens/signin.js';
import { renderDashboard } from './screens/dashboard.js';
import { renderLeads } from './screens/leads.js';
import { renderKanban } from './screens/kanban.js';
import { renderLeadDetail } from './screens/leadDetail.js';
import { renderAddLead } from './screens/addLead.js';
import { renderEditLead } from './screens/editLead.js';
import { renderCalendar, initCalendarControls } from './screens/calendar.js';
import { renderStrategy } from './screens/strategy.js';
import { renderArchive } from './screens/archive.js';
import { renderInteractionModal } from './screens/interactionModal.js';
import { renderOutcomeModal } from './screens/outcomeModal.js';
import { renderImportLeads, renderExportData, renderNotifications, renderTeamManagement } from './screens/placeholders.js';
import { supabase, getLeads, getInteractions, createLead, createInteraction, updateLead, getAllInteractions, getAllInteractionsAll, updateInteraction } from './supabase.js';

class App {
  constructor() {
    this.appElement = document.getElementById('app');
    this.currentRoute = '';
    this.showingModal = false;
    this.currentLeadId = null;
    this.leads = [];
    this.session = null;
    window.app = this;
    // Global sign-in handler — called directly from signin button
    window.handleSignIn = async () => {
      const btn = document.getElementById('signin-btn');
      const errEl = document.getElementById('signin-error');
      const email = document.getElementById('email')?.value?.trim();
      const password = document.getElementById('password')?.value;
      if (!errEl || !btn) return;
      errEl.classList.add('hidden');
      if (!email || !password) {
        errEl.textContent = 'Please enter your email and password.';
        errEl.classList.remove('hidden');
        return;
      }
      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>';
      const result = await window.app.signIn(email, password);
      if (result && result.error) {
        errEl.textContent = result.error.message || 'Incorrect email or password — please try again.';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = 'Enter Dashboard <span class="material-symbols-outlined text-xl">arrow_right_alt</span>';
      }
    };
    this.init();
  }

  async init() {
    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    this.session = session;

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this.session = session;
      if (!session) {
        this.leads = [];
        window.location.hash = '#signin';
      }
    });

    // Handle route changes
    window.addEventListener('hashchange', () => this.render());
    await this.render();
  }

  navigate(route) {
    window.location.hash = route;
  }

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Normalise Supabase error into a plain { message } object for display
      const message = error.message || error.code?.replace(/_/g, ' ') || 'Invalid credentials — please try again.';
      return { error: { message } };
    }
    this.session = data.session;
    await this.loadLeads();
    window.location.hash = '#dashboard';
    return { data };
  }

  async signOut() {
    await supabase.auth.signOut();
    this.session = null;
    this.leads = [];
    window.location.hash = '#signin';
  }

  async loadLeads() {
    this.leads = await getLeads();
  }

  async saveNewLead(leadData) {
    const { data, error } = await createLead(leadData);
    if (!error && data) {
      this.leads.push(data);
    }
    return { data, error };
  }

  async saveInteraction(interactionData) {
    const { data, error } = await createInteraction(interactionData);
    return { data, error };
  }

  async updateLead(id, updates) {
    const { data, error } = await updateLead(id, updates);
    if (!error && data) {
      const idx = this.leads.findIndex(l => l.id === id);
      if (idx !== -1) this.leads[idx] = data;
    }
    return { data, error };
  }

  async completeFollowUp(interactionId, completed = true) {
    const { data, error } = await updateInteraction(interactionId, { completed });
    return { data, error };
  }

  showInteractionModal(leadId) {
    this.currentLeadId = leadId;
    this.showingModal = true;
    this.renderModal();
  }

  closeInteractionModal() {
    this.showingModal = false;
    this.render();
  }

  showOutcomeModal(leadId, currentStage) {
    this.currentLeadId = leadId;
    this.showingOutcomeModal = true;
    this.outcomeStage = currentStage;
    this.renderOutcome();
  }

  closeOutcomeModal() {
    this.showingOutcomeModal = false;
    this.render();
  }

  renderOutcome() {
    const existing = document.getElementById('outcome-modal-wrapper');
    if (existing) existing.remove();
    const container = document.createElement('div');
    container.id = 'outcome-modal-wrapper';
    container.innerHTML = renderOutcomeModal(this.currentLeadId, this.outcomeStage);
    this.appElement.appendChild(container);
  }

  renderModal() {
    const existingModal = document.getElementById('interaction-modal-wrapper');
    if (existingModal) existingModal.remove();

    const modalContainer = document.createElement('div');
    modalContainer.id = 'interaction-modal-wrapper';
    modalContainer.innerHTML = renderInteractionModal(
      this.currentLeadId,
      () => this.closeInteractionModal()
    );
    this.appElement.appendChild(modalContainer);
  }

  showLoading() {
    this.appElement.innerHTML = `
      <div class="min-h-screen flex items-center justify-center">
        <div class="card rounded-3xl px-12 py-10 flex flex-col items-center gap-6">
          <svg width="52" height="40" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="48" rx="6" fill="#14342a"/>
            <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-family="'Manrope',sans-serif" font-weight="800" font-size="11" fill="#3d8b63" letter-spacing="2">EARTHLY</text>
          </svg>
          <div class="w-6 h-6 border-2 border-forest/20 border-t-forest rounded-full animate-spin"></div>
        </div>
      </div>
    `;
  }

  async render() {
    const hash = window.location.hash.slice(1) || 'signin';
    this.currentRoute = hash;

    // Routes that don't require auth
    const publicRoutes = ['signin', ''];
    const isPublic = publicRoutes.includes(hash);

    // If not authenticated and trying to access a protected route, redirect to signin
    if (!this.session && !isPublic) {
      this.appElement.innerHTML = renderSignIn(this.navigate.bind(this));
      window.location.hash = '#signin';
      return;
    }

    // If authenticated and hitting signin, redirect to dashboard
    if (this.session && isPublic) {
      if (this.leads.length === 0) {
        this.showLoading();
        await this.loadLeads();
      }
      window.location.hash = '#dashboard';
      return;
    }

    // Public route — render signin
    if (isPublic) {
      this.appElement.innerHTML = renderSignIn(this.navigate.bind(this));
      return;
    }

    // Load leads if we have a session but haven't loaded yet
    if (this.session && this.leads.length === 0) {
      this.showLoading();
      await this.loadLeads();
    }

    let content = '';

    if (hash === 'dashboard') {
      content = renderDashboard(this.navigate.bind(this), this.leads, this.session);
    } else if (hash === 'leads') {
      content = renderLeads(this.navigate.bind(this), this.leads);
    } else if (hash === 'kanban') {
      content = renderKanban(this.navigate.bind(this), this.leads);
    } else if (hash.startsWith('lead/')) {
      const leadIdRaw = hash.split('/')[1];
      const leadId = parseInt(leadIdRaw);
      if (isNaN(leadId)) {
        content = '<div class="text-center pt-20 text-on-surface-variant">Invalid lead ID.</div>';
      } else {
        const lead = this.leads.find(l => l.id === leadId) || null;
        const interactions = lead ? await getInteractions(leadId) : [];
        content = renderLeadDetail(lead, interactions, this.navigate.bind(this), (id) => this.showInteractionModal(id));
      }
    } else if (hash === 'add-lead') {
      content = renderAddLead(this.navigate.bind(this));
    } else if (hash.startsWith('edit-lead/')) {
      const editIdRaw = hash.split('/')[1];
      const editId = parseInt(editIdRaw);
      const leadToEdit = isNaN(editId) ? null : (this.leads.find(l => l.id === editId) || null);
      content = renderEditLead(leadToEdit, this.navigate.bind(this));
    } else if (hash === 'calendar') {
      const followUps = await getAllInteractions();
      content = renderCalendar(this.navigate.bind(this), followUps, this.leads);
    } else if (hash === 'strategy') {
      content = renderStrategy(this.navigate.bind(this));
    } else if (hash === 'archive') {
      const securedLeads = this.leads.filter(l => l.stage === 'Secured');
      const allInts = await getAllInteractionsAll();
      content = renderArchive(this.navigate.bind(this), securedLeads, allInts);
    } else if (hash === 'import') {
      content = renderImportLeads();
    } else if (hash === 'export') {
      content = renderExportData();
    } else if (hash === 'notifications') {
      content = renderNotifications();
    } else if (hash === 'team') {
      content = renderTeamManagement();
    } else {
      content = '<div class="text-center pt-20 text-on-surface-variant">Route not found: ' + hash + '</div>';
    }

    this.appElement.innerHTML = content;

    // Post-render hooks — calendar month navigation + date filtering
    if (hash === 'calendar') {
      setTimeout(() => initCalendarControls(), 0);
    }

    // Re-attach modals if needed
    if (this.showingModal) {
      this.renderModal();
    }
    if (this.showingOutcomeModal) {
      this.renderOutcome();
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
