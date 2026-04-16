export function renderSignIn(navigate) {
  return `
    <div class="flex min-h-screen overflow-hidden">

      <!-- Hero / Brand side -->
      <div class="hidden lg:flex lg:w-7/12 relative overflow-hidden bg-forest items-end p-20">
        <!-- Forest photo -->
        <div class="absolute inset-0">
          <img alt="Sunlight filtering through a dense green forest canopy" class="w-full h-full object-cover opacity-30 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPHO_JaTjHDGL5tMMrCvawIubo4ZM-yM9CW-oOvuOkRQXO3UrkaHYD55-npi6SFEa6fOKT0U4uvZfM8jM7I0FlcFqmRVaGQNLkctf008FmKL4rjtu8U6PUp5a7spL-bJSgb9hyQep1YGMGGba6TopGx9S4UXxTpzWFYfR1U6GFdW6Fkdihns2V5c0d9pQWX10WvZP7oJ4SoSMi3mXEv44-WBOztqsJj-snjjjnJVzCBM_GIjLds4ryjv1_Oz87VsexKalvL2AIqIw"/>
        </div>
        <!-- Dark gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-forest via-forest/70 to-forest/20"></div>
        <!-- Content -->
        <div class="relative z-10 max-w-xl">
          <!-- Logo -->
          <div class="flex items-center gap-3 mb-12">
            <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8 2 4 5.5 4 10c0 2.5 1.2 4.8 3 6.2V20h10v-3.8c1.8-1.4 3-3.7 3-6.2 0-4.5-4-8-8-8z" fill="#3d8b63" opacity="0.9"/>
                <path d="M9 20v2h6v-2H9z" fill="#3d8b63" opacity="0.6"/>
              </svg>
            </div>
            <span style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-white tracking-tight">Biome</span>
          </div>
          <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl text-white leading-tight font-semibold mb-6">
            Cultivate growth through <em class="font-normal text-canopy">intentional</em> outreach.
          </h1>
          <p class="text-white/60 text-lg leading-relaxed">
            The Biome Outreach Tracker provides the clarity and calm required for high-stakes environmental investment.
          </p>
          <!-- Stat strip -->
          <div class="mt-12 flex items-center gap-8">
            <div>
              <p class="text-2xl font-bold text-white">$2.4B+</p>
              <p class="text-white/50 text-xs uppercase tracking-wider mt-1">Capital Tracked</p>
            </div>
            <div class="w-px h-10 bg-white/20"></div>
            <div>
              <p class="text-2xl font-bold text-white">340+</p>
              <p class="text-white/50 text-xs uppercase tracking-wider mt-1">Organisations</p>
            </div>
            <div class="w-px h-10 bg-white/20"></div>
            <div>
              <p class="text-2xl font-bold text-canopy">Live</p>
              <p class="text-white/50 text-xs uppercase tracking-wider mt-1">Pipeline</p>
            </div>
          </div>
        </div>
        <!-- Decorative tree silhouette -->
        <div class="absolute top-12 right-12 opacity-5">
          <span class="material-symbols-outlined text-white" style="font-size:16rem;">park</span>
        </div>
      </div>

      <!-- Sign-in panel -->
      <main class="w-full lg:w-5/12 flex flex-col justify-center px-8 sm:px-16 lg:px-20 relative overflow-hidden" style="background: rgba(255,255,255,0.88); backdrop-filter: blur(24px) saturate(1.3);">

        <!-- Mobile logo -->
        <div class="lg:hidden absolute top-10 left-8 flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-forest flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2C8 2 4 5.5 4 10c0 2.5 1.2 4.8 3 6.2V20h10v-3.8c1.8-1.4 3-3.7 3-6.2 0-4.5-4-8-8-8z" fill="#3d8b63"/></svg>
          </div>
          <span style="font-family:'Fraunces',Georgia,serif;" class="text-xl font-semibold text-forest">Biome</span>
        </div>

        <div class="max-w-sm w-full mx-auto lg:mx-0">

          <!-- Header -->
          <div class="mb-10">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-meadow text-forest text-[10px] font-bold uppercase tracking-widest mb-5">
              <span class="w-1.5 h-1.5 rounded-full bg-canopy inline-block"></span>
              Secure Access
            </span>
            <h2 style="font-family:'Fraunces',Georgia,serif;" class="text-4xl font-semibold text-forest mb-2">Welcome back</h2>
            <p class="text-ink-soft text-base">Sign in to access the Living Archive.</p>
          </div>

          <form class="space-y-5" id="signin-form" onsubmit="return false;">

            <!-- Email -->
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Email</label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-ink-ghost text-base group-focus-within:text-forest transition-colors">mail</span>
                <input class="w-full pl-11 pr-4 py-3.5 bg-surface-low border border-border-soft rounded-xl text-sm text-ink placeholder:text-ink-ghost focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" id="email" name="email" placeholder="name@institution.com" type="email"/>
              </div>
            </div>

            <!-- Password -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost">Password</label>
                <a class="text-[10px] font-bold text-forest hover:text-canopy transition-colors cursor-pointer uppercase tracking-wider">Lost access?</a>
              </div>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-ink-ghost text-base group-focus-within:text-forest transition-colors">lock</span>
                <input class="w-full pl-11 pr-4 py-3.5 bg-surface-low border border-border-soft rounded-xl text-sm text-ink placeholder:text-ink-ghost focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" id="password" name="password" placeholder="••••••••••••" type="password"/>
              </div>
            </div>

            <!-- Error -->
            <div id="signin-error" class="hidden px-4 py-3 bg-error-bg text-error rounded-xl text-sm font-medium"></div>

            <!-- Remember me -->
            <div class="flex items-center gap-3 pt-1">
              <input class="h-4 w-4 accent-forest rounded" id="remember-me" name="remember-me" type="checkbox" checked/>
              <label for="remember-me" class="text-sm text-ink-soft cursor-pointer">Keep me signed in for 30 days</label>
            </div>

            <!-- Submit -->
            <button id="signin-btn" class="btn-primary w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer" type="button" onclick="window.handleSignIn()">
              Enter Dashboard
              <span class="material-symbols-outlined text-base">arrow_right_alt</span>
            </button>

          </form>

          <p class="mt-10 text-sm text-ink-ghost text-center lg:text-left">
            New to the initiative?
            <a class="text-forest font-semibold hover:text-canopy transition-colors cursor-pointer">Request access</a>
          </p>

        </div>

        <!-- Subtle bg blob -->
        <div class="absolute bottom-0 right-0 w-72 h-72 bg-meadow rounded-full blur-3xl -z-10 -mr-24 -mb-24 opacity-60"></div>
      </main>

    </div>
  `;
}
