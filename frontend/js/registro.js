const profileSelect = document.getElementById("perfil");
const profileHint = document.getElementById("perfil-ayuda");
const registerButtonIcon = document.getElementById("register-button-icon");
const registerButtonLabel = document.getElementById("register-button-label");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmar-password");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const themeIcon = document.getElementById("theme-icon");

const profileOptions = {
    turista: {
        icon: "🧳",
        label: "Crear cuenta de turista",
        hint: "Para quienes quieren descubrir nuevos destinos."
    },
    guia: {
        icon: "🧭",
        label: "Crear cuenta de guía",
        hint: "Comparte tu experiencia y guía a otros viajeros."
    },
    prestador: {
        icon: "🏨",
        label: "Crear cuenta de prestador",
        hint: "Da a conocer tu hotel, restaurante u otro servicio."
    },
    todos: {
        icon: "✨",
        label: "Crear cuenta con todos los perfiles",
        hint: "Seleccionaste turista, guía y prestador de servicios."
    }
};

function updateProfileDetails() {
    const selectedProfile = profileOptions[profileSelect.value];
    registerButtonIcon.textContent = selectedProfile.icon;
    registerButtonLabel.textContent = selectedProfile.label;
    profileHint.textContent = selectedProfile.hint;
}

function validatePasswords() {
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    confirmPasswordInput.setCustomValidity(passwordsMatch ? "" : "Las contraseñas no coinciden.");
}

profileSelect.addEventListener("change", updateProfileDetails);
passwordInput.addEventListener("input", validatePasswords);
confirmPasswordInput.addEventListener("input", validatePasswords);

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
