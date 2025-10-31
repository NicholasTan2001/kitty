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

        const maxMove = 50;
        const totalCats = 20;
        let currentCatIndex = 0;
        let following = false;
        let moveKitty = null;

        // Function to load a random cat image
        function loadNewCat() {
            kittyContainer.innerHTML = "";
            const img = document.createElement("img");
            img.src = `https://cataas.com/cat?width=300&height=300&random=${Math.random()}`;
            img.alt = "Kitty Image";
            img.className =
                "rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 cursor-pointer";
            img.style.position = "relative";
            img.style.transition = "left 0.3s ease, opacity 0.3s ease";
            kittyContainer.appendChild(img);

            img.addEventListener("click", () => {
                if (!following) {
                    following = true;
                    img.classList.add("shadow-[0_0_30px_rgba(59,130,246,0.8)]");

                    moveKitty = function (e) {
                        const containerRect = kittyContainer.getBoundingClientRect();
                        const mouseX = e.clientX - containerRect.left;
                        const center = containerRect.width / 2;
                        let offset = mouseX - center;

                        offset = Math.max(-maxMove, Math.min(maxMove, offset));

                        const distance = Math.abs(offset);
                        const minOpacity = 0.3;
                        const opacity = 1 - (distance / maxMove) * (1 - minOpacity);
                        img.style.opacity = opacity;
                        img.style.left = `${offset}px`;

                        // Shadow color change
                        if (offset >= maxMove) {
                            container3.style.boxShadow = "0 0 25px rgba(154, 237, 185, 0.8)"; // green
                            fadeAndNextCat();
                        } else if (offset <= -maxMove) {
                            container3.style.boxShadow = "0 0 25px rgba(255, 102, 102, 0.8)"; // red
                            fadeAndNextCat();
                        } else {
                            container3.style.boxShadow = "0 0 25px rgba(255,255,255,0.8)";
                        }
                    };

                    document.addEventListener("mousemove", moveKitty);
                } else {
                    stopFollowing();
                }
            });

            // Function to stop following
            function stopFollowing() {
                following = false;
                document.removeEventListener("mousemove", moveKitty);
                img.style.left = "0px";
                img.style.opacity = "1";
                img.classList.remove("shadow-[0_0_30px_rgba(59,130,246,0.8)]");
                container3.style.boxShadow = "0 0 25px rgba(255,255,255,0.8)";
            }

            function fadeAndNextCat() {
                document.removeEventListener("mousemove", moveKitty);
                img.style.transition = "opacity 0.6s ease";
                img.style.opacity = "0";
                following = false;

                setTimeout(() => {
                    currentCatIndex++;
                    if (currentCatIndex < totalCats) {
                        container3.style.boxShadow = "0 0 25px rgba(255,255,255,0.8)";
                        loadNewCat();
                    } else {
                        kittyContainer.innerHTML = `<p class="text-lg text-gray-700 font-semibold">You've seen all ${totalCats} kitties! 🐾</p>`;
                        container3.style.boxShadow = "0 0 25px rgba(255,255,255,0.8)";
                    }
                }, 600);
            }
        }

        loadNewCat();
    }, 800);

    setTimeout(() => {
        container3.classList.remove("hidden");
    }, 2000);
});
