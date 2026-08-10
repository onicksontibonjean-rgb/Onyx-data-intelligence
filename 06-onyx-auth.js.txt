/* ONYX AUTH — Google login, session, user profile, logout */

(function onyxAuthModule() {
  const $ = (id) => document.getElementById(id);
  let authSubscription = null;

  const gate = () => $("onyxAuthGate");
  const status = () => $("onyxAuthStatus");
  const googleBtn = () => $("onyxGoogleLoginBtn");

  function setStatus(message, isError = false) {
    const el = status();
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("error", Boolean(isError));
  }

  function lockApp(message = "Connexion requise.") {
    document.body.classList.remove("onyx-auth-pending");
    document.body.classList.add("onyx-auth-locked");
    if (gate()) gate().setAttribute("aria-hidden", "false");
    setStatus(message, false);
  }

  function unlockApp() {
    document.body.classList.remove("onyx-auth-pending", "onyx-auth-locked");
    if (gate()) gate().setAttribute("aria-hidden", "true");
  }

  function initialsFromUser(user) {
    const meta = user?.user_metadata || {};
    const name = meta.full_name || meta.name || user?.email || "U";
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "U";
  }

  function userDisplay(user) {
    const meta = user?.user_metadata || {};
    return {
      name: meta.full_name || meta.name || user?.email?.split("@")[0] || "Utilisateur Onyx",
      email: user?.email || "",
      avatar: meta.avatar_url || meta.picture || ""
    };
  }

  function removeUserMenu() {
    document.getElementById("onyxUserBox")?.remove();
  }

  function renderUserMenu(user) {
    removeUserMenu();
    const actions = document.querySelector(".topbar .actions");
    if (!actions || !user) return;

    const profile = userDisplay(user);
    const box = document.createElement("div");
    box.id = "onyxUserBox";
    box.className = "onyx-user-box";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "onyx-user-trigger";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", "Ouvrir le menu utilisateur");

    if (profile.avatar) {
      const img = document.createElement("img");
      img.className = "onyx-user-avatar";
      img.src = profile.avatar;
      img.alt = "";
      img.referrerPolicy = "no-referrer";
      trigger.appendChild(img);
    } else {
      const fallback = document.createElement("span");
      fallback.className = "onyx-user-fallback";
      fallback.textContent = initialsFromUser(user);
      trigger.appendChild(fallback);
    }

    const copy = document.createElement("span");
    copy.className = "onyx-user-copy";
    const name = document.createElement("strong");
    name.textContent = profile.name;
    const email = document.createElement("span");
    email.textContent = profile.email;
    copy.append(name, email);

    const chevron = document.createElement("span");
    chevron.className = "onyx-user-chevron";
    chevron.textContent = "▾";
    trigger.append(copy, chevron);

    const menu = document.createElement("div");
    menu.className = "onyx-user-menu";

    const head = document.createElement("div");
    head.className = "onyx-user-menu-head";
    const headName = document.createElement("strong");
    headName.textContent = profile.name;
    const headEmail = document.createElement("span");
    headEmail.textContent = profile.email;
    head.append(headName, headEmail);

    const logout = document.createElement("button");
    logout.type = "button";
    logout.textContent = "Se déconnecter";
    logout.addEventListener("click", signOut);

    menu.append(head, logout);
    box.append(trigger, menu);
    actions.appendChild(box);

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = box.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", () => {
      box.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }, { once: true });
  }

  async function signInWithGoogle() {
    if (!window.ONYX_AUTH_CONFIGURED || !window.onyxSupabase) {
      setStatus("Configuration Supabase incomplète. Renseigne d'abord l'URL du projet et la Publishable key.", true);
      return;
    }

    const button = googleBtn();
    if (button) button.disabled = true;
    setStatus("Redirection sécurisée vers Google…");

    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { error } = await window.onyxSupabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Onyx Auth — Google sign-in error", error);
      setStatus(error?.message || "Impossible de démarrer la connexion Google.", true);
      if (button) button.disabled = false;
    }
  }

  async function signOut() {
    if (!window.onyxSupabase) return;
    try {
      const { error } = await window.onyxSupabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      removeUserMenu();
      lockApp("Session terminée. Connecte-toi pour accéder à Onyx.");
    } catch (error) {
      console.error("Onyx Auth — sign-out error", error);
      alert("La déconnexion n'a pas pu être terminée. Réessaie.");
    }
  }

  async function validateCurrentUser() {
    if (!window.ONYX_AUTH_CONFIGURED) {
      lockApp("Configuration requise : renseigne Supabase dans 05-supabase-client.js.");
      const button = googleBtn();
      if (button) button.disabled = true;
      return;
    }

    if (!window.onyxSupabase) {
      lockApp("Le service d'authentification n'a pas pu être initialisé.");
      return;
    }

    setStatus("Vérification de la session…");

    const { data, error } = await window.onyxSupabase.auth.getUser();
    if (error || !data?.user) {
      lockApp("Connecte-toi avec ton compte Google pour accéder à l'espace Onyx.");
      if (googleBtn()) googleBtn().disabled = false;
      return;
    }

    renderUserMenu(data.user);
    unlockApp();
  }

  function subscribeToAuthChanges() {
    if (!window.onyxSupabase) return;
    const result = window.onyxSupabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        removeUserMenu();
        lockApp("Session terminée. Connecte-toi pour accéder à Onyx.");
        if (googleBtn()) googleBtn().disabled = false;
        return;
      }

      if (["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED", "INITIAL_SESSION"].includes(event)) {
        renderUserMenu(session.user);
        unlockApp();
      }
    });
    authSubscription = result?.data?.subscription || null;
  }

  async function init() {
    googleBtn()?.addEventListener("click", signInWithGoogle);
    subscribeToAuthChanges();
    await validateCurrentUser();
  }

  window.addEventListener("beforeunload", () => authSubscription?.unsubscribe?.());
  document.addEventListener("DOMContentLoaded", init, { once: true });
})();
