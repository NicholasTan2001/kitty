document.getElementById("submit").addEventListener("click", function () {
    const name = document.getElementById("name").value.trim();
    const container1 = document.getElementById("container");
    const container2 = document.getElementById("container2");
    const container3 = document.getElementById("container3");
    const welcome = document.getElementById("welcome");
    const errorMsg = document.getElementById("errorMsg");

    if (name === "") {
        errorMsg.classList.remove("hidden");
        return;
    }

    errorMsg.classList.add("hidden");

    container1.classList.remove("animate-fade-up");
    container1.classList.add("animate-fade-up-exit");

    setTimeout(() => {
        container1.classList.add("hidden");
        welcome.textContent = `Welcome, ${name} !`;
        container2.classList.remove("hidden");

        const kittyContainer = document.getElementById("kittyContainer");
        kittyContainer.innerHTML = "";

        const img = document.createElement("img");
        img.src = `https://cataas.com/cat?width=300&height=300&random=${Math.random()}`;
        img.alt = "Kitty Image";
        img.className =
            "rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 cursor-pointer";
        kittyContainer.appendChild(img);

        img.addEventListener("click", () => {
            img.classList.add("shadow-[0_0_30px_rgba(59,130,246,0.8)]");
        });
    }, 800);

    setTimeout(() => {
        container3.classList.remove("hidden");
    }, 2000);
});
