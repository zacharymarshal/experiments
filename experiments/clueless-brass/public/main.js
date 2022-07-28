const sprite = document.getElementById("sprite");
document.getElementById("slider").addEventListener("input", (e) => {
  sprite.style.backgroundPosition = `-${e.target.value}px 0px`;
});
