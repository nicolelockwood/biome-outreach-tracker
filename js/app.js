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
import { supabase, getLeads, getInteractions, createLead, createInteraction, updateLead, deleteLead, getAllInteractions, getAllInteractionsAll, updateInteraction } from './supabase.js';

class App {
  constructor() {
    this.appElement = document.getElementById('app');
    this.currentRoute = '';
    this.showingModal = false;
    this.currentLeadId = null;
    this.leads = [];
    this.session = null;
    window.app = this;
    // Global save-lead handler — called from addLead form button
    window.handleSaveLead = async () => {
      const btn = document.getElementById('save-lead-btn');
      const errEl = document.getElementById('add-lead-error');
      if (!btn || !errEl) return;
      errEl.classList.add('hidden');

      const orgName = document.getElementById('al-org-name')?.value?.trim();
      const firstName = document.getElementById('al-first-name')?.value?.trim() || '';
      const lastName = document.getElementById('al-last-name')?.value?.trim() || '';
      const contactName = [firstName, lastName].filter(Boolean).join(' ');
      const contactTitle = document.getElementById('al-title')?.value?.trim() || null;
      const phone = document.getElementById('al-phone')?.value?.trim() || null;
      const email = document.getElementById('al-email')?.value?.trim() || null;
      const website = document.getElementById('al-website')?.value?.trim() || null;
      const stage = document.getElementById('add-lead-stage')?.value || 'New';
      const region = document.getElementById('add-lead-region')?.value || 'Australia';
      const ticketRaw = document.getElementById('al-ticket')?.value?.trim() || '';
      const ticketSize = ticketRaw ? (ticketRaw.startsWith('$') ? ticketRaw : '$' + ticketRaw) : null;
      const notes = document.getElementById('al-notes')?.value?.trim() || null;

      const activePriorityBtn = document.querySelector('.priority-btn.bg-forest') || document.querySelector('.priority-btn.bg-error') || document.querySelector('.priority-btn.bg-meadow');
      const priority = activePriorityBtn?.dataset?.priority || 'Medium';

      const checkedTypes = [...document.querySelectorAll('input[name=lead_type]:checked')].map(i => i.value);
      if (checkedTypes.length === 0) {
        errEl.textContent = 'Please select at least one lead type.';
        errEl.classList.remove('hidden');
        return;
      }
      const category = checkedTypes.join(',');

      if (!orgName) {
        errEl.textContent = 'Organisation name is required.';
        errEl.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>';

      const initials = contactName ? contactName.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) : (orgName.slice(0, 2).toUpperCase());
      const leadData = {
        org_name: orgName,
        contact_name: contactName || null,
        contact_initials: initials,
        contact_title: contactTitle,
        phone,
        email,
        website,
        stage,
        priority,
        ticket_size: ticketSize,
        category,
        region,
        comments: notes,
        tags: []
      };

      const { data, error } = await window.app.saveNewLead(leadData);
      if (error) {
        errEl.textContent = error.message || 'Failed to save lead. Please try again.';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">save</span> Initialize Lead';
      } else {
        window.app.navigate('#leads');
      }
    };

    // Global save-interaction handler — called from interaction modal
    window.handleSaveInteraction = async () => {
      const btn = document.getElementById('int-save-btn');
      const errEl = document.getElementById('int-error');
      if (!btn || !errEl) return;
      errEl.classList.add('hidden');

      const date = document.getElementById('int-date')?.value;
      const type = document.getElementById('int-type')?.value;
      const summary = document.getElementById('int-summary')?.value?.trim();
      const outcome = document.getElementById('int-outcome')?.value;
      const followUpAction = document.getElementById('int-action')?.value?.trim() || null;
      const followUpDate = document.getElementById('int-followup')?.value || null;

      if (!summary) {
        errEl.textContent = 'Please add a summary before saving.';
        errEl.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>';

      const { data, error } = await window.app.saveInteraction({
        lead_id: window.app.currentLeadId,
        date,
        type,
        summary,
        outcome,
        follow_up_action: followUpAction,
        follow_up_date: followUpDate
      });

      if (error) {
        errEl.textContent = error.message || 'Failed to save. Please try again.';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">add_circle</span> Record Interaction';
      } else {
        window.app.closeInteractionModal();
      }
    };

    // Global save-outcome handler — called from outcome modal
    window.handleSaveOutcome = async () => {
      const btn = document.getElementById('outcome-save-btn');
      const errEl = document.getElementById('outcome-error');
      if (!btn || !errEl) return;
      errEl.classList.add('hidden');

      const stage = document.getElementById('outcome-stage')?.value;
      const note = document.getElementById('outcome-note')?.value?.trim();

      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>';

      const updates = { stage };
      if (note) updates.comments = note;

      const { data, error } = await window.app.updateLead(window.app.currentLeadId, updates);
      if (error) {
        errEl.textContent = error.message || 'Failed to save. Please try again.';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">verified</span> Confirm Outcome';
      } else {
        window.app.closeOutcomeModal();
      }
    };

    // Global update-lead handler — called from editLead form button
    window.handleUpdateLead = async () => {
      const btn = document.getElementById('update-lead-btn');
      const errEl = document.getElementById('edit-lead-error');
      if (!btn || !errEl) return;
      errEl.classList.add('hidden');

      // Get lead ID from current route hash
      const hash = window.location.hash.slice(1);
      const leadId = parseInt(hash.split('/')[1]);
      if (isNaN(leadId)) return;

      const orgName = document.getElementById('el-org-name')?.value?.trim();
      const firstName = document.getElementById('el-first-name')?.value?.trim() || '';
      const lastName = document.getElementById('el-last-name')?.value?.trim() || '';
      const contactName = [firstName, lastName].filter(Boolean).join(' ');
      const contactTitle = document.getElementById('el-title')?.value?.trim() || null;
      const phone = document.getElementById('el-phone')?.value?.trim() || null;
      const email = document.getElementById('el-email')?.value?.trim() || null;
      const website = document.getElementById('el-website')?.value?.trim() || null;
      const stage = document.getElementById('edit-lead-stage')?.value || 'New';
      const region = document.getElementById('edit-lead-region')?.value || 'Australia';
      const ticketRaw = document.getElementById('el-ticket')?.value?.trim() || '';
      const ticketSize = ticketRaw ? (ticketRaw.startsWith('$') ? ticketRaw : '$' + ticketRaw) : null;
      const notes = document.getElementById('el-notes')?.value?.trim() || null;
      const action = document.getElementById('el-action')?.value?.trim() || null;
      const followUp = document.getElementById('el-followup')?.value?.trim() || null;

      const activePriorityBtn = document.querySelector('.priority-btn.bg-forest') || document.querySelector('.priority-btn.bg-error') || document.querySelector('.priority-btn.bg-meadow');
      const priority = activePriorityBtn?.dataset?.priority || 'Medium';

      const checkedTypes = [...document.querySelectorAll('input[name=lead_type]:checked')].map(i => i.value);
      if (checkedTypes.length === 0) {
        errEl.textContent = 'Please select at least one lead type.';
        errEl.classList.remove('hidden');
        return;
      }
      const category = checkedTypes.join(',');

      if (!orgName) {
        errEl.textContent = 'Organisation name is required.';
        errEl.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>';

      const initials = contactName ? contactName.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) : (orgName.slice(0, 2).toUpperCase());
      const updates = {
        org_name: orgName,
        contact_name: contactName || null,
        contact_initials: initials,
        contact_title: contactTitle,
        phone,
        email,
        website,
        stage,
        priority,
        ticket_size: ticketSize,
        category,
        region,
        comments: notes,
        action,
        next_follow_up: followUp
      };

      const { data, error } = await window.app.updateLead(leadId, updates);
      if (error) {
        errEl.textContent = error.message || 'Failed to update lead. Please try again.';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">save</span> Save Changes';
      } else {
        window.app.navigate('#lead/' + leadId);
      }
    };

    // Global delete-lead handler — called from lead detail page
    window.handleDeleteLead = async (leadId) => {
      if (!confirm('Are you sure you want to permanently delete this lead and all its interactions? This cannot be undone.')) return;
      const { error } = await window.app.removeLead(leadId);
      if (error) {
        alert('Failed to delete lead: ' + (error.message || 'Unknown error'));
      } else {
        window.app.navigate('#leads');
      }
    };

    // Global sign-in handler â called directly from signin button
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
        errEl.textContent = result.error.message || 'Incorrect email or password â please try again.';
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
      const message = error.message || error.code?.replace(/_/g, ' ') || 'Invalid credentials â please try again.';
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
    if (error) {
      console.error('saveNewLead failed:', error);
    } else {
      console.log('Lead saved successfully:', data?.id, data?.org_name);
      // Force refresh from DB to ensure local state matches persisted state
      await this.loadLeads();
    }
    return { data, error };
  }

  async saveInteraction(interactionData) {
    const { data, error } = await createInteraction(interactionData);
    if (error) {
      console.error('saveInteraction failed:', error);
    } else {
      console.log('Interaction saved:', data?.id);
      // Refresh leads to pick up any follow_up_date changes
      await this.loadLeads();
    }
    return { data, error };
  }

  async updateLead(id, updates) {
    const { data, error } = await updateLead(id, updates);
    if (error) {
      console.error('updateLead failed:', error);
    } else {
      console.log('Lead updated:', id, Object.keys(updates));
      // Force refresh from DB — don't rely on local array splice
      await this.loadLeads();
    }
    return { data, error };
  }

  async completeFollowUp(interactionId, completed = true) {
    const { data, error } = await updateInteraction(interactionId, { completed });
    if (error) {
      console.error('completeFollowUp failed:', error);
    }
    return { data, error };
  }

  async removeLead(id) {
    const { error } = await deleteLead(id);
    if (error) {
      console.error('removeLead failed:', error);
    } else {
      console.log('Lead deleted:', id);
      await this.loadLeads();
    }
    return { error };
  }

  showInteractionModal(leadId) {
    this.currentLeadId = leadId;
    this.showingModal = true;
    this.renderModal();
  }

  closeInteractionModal() {
    this.showingModal = false;
    const wrapper = document.getElementById('interaction-modal-wrapper');
    if (wrapper) wrapper.remove();
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
    const wrapper = document.getElementById('outcome-modal-wrapper');
    if (wrapper) wrapper.remove();
    this.render();
  }

  renderOutcome() {
    try {
      const existing = document.getElementById('outcome-modal-wrapper');
      if (existing) existing.remove();
      const container = document.createElement('div');
      container.id = 'outcome-modal-wrapper';
      container.innerHTML = renderOutcomeModal(this.currentLeadId, this.outcomeStage);
      document.body.appendChild(container);
      // Scroll the modal overlay to top so form is visible
      const overlay = container.querySelector('.fixed');
      if (overlay) overlay.scrollTop = 0;
    } catch (e) {
      console.error('Outcome modal render error:', e);
    }
  }

  renderModal() {
    try {
      const existingModal = document.getElementById('interaction-modal-wrapper');
      if (existingModal) existingModal.remove();

      const modalContainer = document.createElement('div');
      modalContainer.id = 'interaction-modal-wrapper';
      modalContainer.innerHTML = renderInteractionModal(
        this.currentLeadId,
        () => this.closeInteractionModal()
      );
      document.body.appendChild(modalContainer);
      // Scroll the modal overlay to top so form is visible
      const overlay = modalContainer.querySelector('.fixed');
      if (overlay) overlay.scrollTop = 0;
    } catch (e) {
      console.error('Interaction modal render error:', e);
    }
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

    // Public route â render signin
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

    // Post-render hooks â calendar month navigation + date filtering
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
