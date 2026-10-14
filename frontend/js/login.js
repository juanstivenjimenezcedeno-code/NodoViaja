const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const themeIcon = document.getElementById("theme-icon");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("password-toggle");
const passwordToggleLabel = document.getElementById("password-toggle-label");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

function showLoginMessage(message, isError = true) {
    loginMessage.textContent = message;
    loginMessage.className = `text-center text-sm ${isError ? "text-red-400" : "text-teal-400"}`;
    if (document.body.dataset.theme === "light") {
        loginMessage.classList.replace(isError ? "text-red-400" : "text-teal-400", isError ? "text-red-700" : "text-teal-700");
    }
}

if (new URLSearchParams(window.location.search).get("registro") === "sin-servidor") {
    showLoginMessage("Sin servidor, el registro no guarda una cuenta. Puedes continuar al sitio.", false);
}

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) {
        return;
    }

    window.location.assign("../no_funcional/index2.html");
});

themeToggle.addEventListener("click", () => {
    const isDark = document.body.dataset.theme === "dark";
    const theme = isDark ? "light" : "dark";
    document.body.dataset.theme = theme;

    document.querySelectorAll("[data-dark-class][data-light-class]").forEach((element) => {
        element.className = element.dataset[`${theme}Class`];
    });

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
    themeLabel.textContent = isDark ? "Modo oscuro" : "Modo claro";
    themeIcon.textContent = isDark ? "☾" : "☀";
});

passwordToggle.addEventListener("click", () => {
    const showPassword = passwordInput.type === "password";
    passwordInput.type = showPassword ? "text" : "password";
    passwordToggle.setAttribute("aria-pressed", String(showPassword));
    passwordToggle.setAttribute("aria-label", showPassword ? "Ocultar contraseña" : "Mostrar contraseña");
    passwordToggleLabel.textContent = showPassword ? "Ocultar" : "Mostrar";
});