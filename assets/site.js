// Small touches: gameplay clips on hover, paw prints on click, click-to-copy email.

// Hovering a polaroid plays the game's clip over its cover (mouse/trackpad only).
if (matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".polaroid").forEach((polaroid) => {
    const clip = polaroid.querySelector(".clip");
    if (!clip) return;
    polaroid.addEventListener("mouseenter", () => {
      clip.preload = "auto";
      clip.play().then(() => clip.classList.add("on")).catch(() => {});
    });
    polaroid.addEventListener("mouseleave", () => {
      clip.classList.remove("on");
      clip.pause();
    });
  });
}

// Clicking empty space leaves a pink paw print that fades away.
const PAW =
  '<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="#ff0cc5">' +
  '<ellipse cx="20" cy="27" rx="9" ry="7.5"/>' +
  '<ellipse cx="9" cy="16.5" rx="3.6" ry="4.6" transform="rotate(-20 9 16.5)"/>' +
  '<ellipse cx="16" cy="9.5" rx="3.8" ry="4.8" transform="rotate(-6 16 9.5)"/>' +
  '<ellipse cx="24" cy="9.5" rx="3.8" ry="4.8" transform="rotate(6 24 9.5)"/>' +
  '<ellipse cx="31" cy="16.5" rx="3.6" ry="4.6" transform="rotate(20 31 16.5)"/>' +
  "</g></svg>";

document.addEventListener("click", (e) => {
  if (e.button !== 0 || e.target.closest("a, button, input, textarea, select, label, video, .logo")) return;
  const paw = document.createElement("span");
  paw.className = "paw";
  paw.style.left = e.pageX + "px";
  paw.style.top = e.pageY + "px";
  paw.style.setProperty("--r", Math.round(Math.random() * 50 - 25) + "deg");
  paw.innerHTML = PAW;
  document.body.appendChild(paw);
  // animationend can be skipped (e.g. background tabs), so also clean up on a timer.
  paw.addEventListener("animationend", () => paw.remove());
  setTimeout(() => paw.remove(), 2000);
});

// Clicking the email copies it and says so. Without clipboard access it
// falls back to opening the mail app like a normal mailto link.
document.querySelectorAll("a.mail").forEach((mail) => {
  mail.addEventListener("click", async (e) => {
    if (!navigator.clipboard) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(mail.href.replace(/^mailto:/, ""));
    } catch {
      location.href = mail.href;
      return;
    }
    mail.querySelector(".copied")?.remove();
    const note = document.createElement("span");
    note.className = "copied";
    note.textContent = "copied!";
    mail.appendChild(note);
    note.addEventListener("animationend", () => note.remove());
    setTimeout(() => note.remove(), 2000);
  });
});
