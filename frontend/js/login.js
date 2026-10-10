const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const themeIcon = document.getElementById("theme-icon");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("password-toggle");
const passwordToggleLabel = document.getElementById("password-toggle-label");

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