document.getElementById("submit").addEventListener("click", function () {
    const name = document.getElementById("name").value.trim();
    const container1 = document.getElementById("container");
    const container2 = document.getElementById("container2");
    const container3 = document.getElementById("container3");
    const container4 = document.getElementById("container4");
    const welcome = document.getElementById("welcome");
    const errorMsg = document.getElementById("errorMsg");
    const resultContainer = document.getElementById("resultContainer");

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
        const totalCats = 5;
        let currentCatIndex = 0;
        const catMap = new Map();

        loadNewCat();

        function loadNewCat() {
            kittyContainer.innerHTML = "";

            const loadingText = document.createElement("p");
            loadingText.textContent = "Loading ...";
            loadingText.className = "rounded-2xl opacity-70 animate-pulse text-gray-500 font-semibold text-xl flex items-center justify-center";
            loadingText.style.width = "300px";
            loadingText.style.height = "300px";
            loadingText.style.display = "flex";
            loadingText.style.alignItems = "center";
            loadingText.style.justifyContent = "center";
            kittyContainer.appendChild(loadingText);

            const catRandom = Math.floor(Math.random() * 1000000);
            const img = document.createElement("img");
            img.src = `https://cataas.com/cat?width=300&height=300&random=${catRandom}`;
            img.alt = "Kitty Image";
            img.className =
                "rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 cursor-pointer select-none";
            img.style.position = "relative";
            img.style.transition = "left 0.3s ease, opacity 0.3s ease";
            img.style.opacity = "0";

            img.onload = () => {
                kittyContainer.innerHTML = "";
                kittyContainer.appendChild(img);
                setTimeout(() => img.style.opacity = "1", 50);
                setupKittyInteractions(img, catRandom);
            };

            img.onerror = () => {
                kittyContainer.innerHTML = `<p class="text-gray-600 text-center">Failed to load kitty 😿</p>`;
            };
        }

        function setupKittyInteractions(img, catRandom) {
            let following = false;
            let moveKitty = null;

            function handleMove(clientX) {
                const containerRect = kittyContainer.getBoundingClientRect();
                const mouseX = clientX - containerRect.left;
                const center = containerRect.width / 2;
                let offset = mouseX - center;
                offset = Math.max(-maxMove, Math.min(maxMove, offset));

                const distance = Math.abs(offset);
                const minOpacity = 0.3;
                const opacity = 1 - (distance / maxMove) * (1 - minOpacity);
                img.style.opacity = opacity;
                img.style.left = `${offset}px`;

                if (offset >= maxMove) {
                    container3.style.boxShadow = "0 0 50px rgba(146, 255, 173, 1)";
                    catMap.set(catRandom, true);
                    fadeAndNextCat();
                } else if (offset <= -maxMove) {
                    container3.style.boxShadow = "0 0 50px rgba(254, 127, 127, 0.8)";
                    catMap.set(catRandom, false);
                    fadeAndNextCat();
                } else {
                    container3.style.boxShadow = "0 0 25px rgba(255,255,255,0.8)";
                }
            }

            img.addEventListener("click", () => {
                if (!following) {
                    following = true;
                    img.classList.add("shadow-[0_0_30px_rgba(59,130,246,0.8)]");

                    moveKitty = (e) => handleMove(e.clientX);
                    document.addEventListener("mousemove", moveKitty);
                    document.addEventListener("touchmove", onTouchMove);
                } else stopFollowing();
            });

            function onTouchMove(e) {
                if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
            }

            function stopFollowing() {
                following = false;
                document.removeEventListener("mousemove", moveKitty);
                document.removeEventListener("touchmove", onTouchMove);
                img.style.left = "0px";
                img.style.opacity = "1";
                img.classList.remove("shadow-[0_0_30px_rgba(59,130,246,0.8)]");
                container3.style.boxShadow = "0 0 25px rgba(255,255,255,0.8)";
            }

            document.addEventListener("mouseup", stopFollowing);
            document.addEventListener("touchend", stopFollowing);

            function fadeAndNextCat() {
                document.removeEventListener("mousemove", moveKitty);
                document.removeEventListener("touchmove", onTouchMove);
                img.style.transition = "opacity 0.6s ease";
                img.style.opacity = "0";
                following = false;

                setTimeout(() => {
                    currentCatIndex++;
                    if (currentCatIndex < totalCats) {
                        container3.style.boxShadow = "0 0 25px rgba(255,255,255,0.8)";
                        loadNewCat();
                    } else {
                        showResults();
                    }
                }, 600);
            }
        }

        function showResults() {
            container3.classList.add("hidden");
            container4.classList.remove("hidden");

            const likedContainer = document.getElementById("resultLikedContainer");
            const unlikedContainer = document.getElementById("resultUnlikedContainer");

            likedContainer.innerHTML = "";
            unlikedContainer.innerHTML = "";

            catMap.forEach((liked, randomNum) => {
                const card = document.createElement("div");
                card.className = "flex flex-col items-center bg-white rounded-xl p-3";

                card.style.boxShadow = liked
                    ? "0 0 30px rgba(146, 255, 173, 1)"
                    : "0 0 30px rgba(254, 127, 127, 0.8)";

                const img = document.createElement("img");
                img.src = `https://cataas.com/cat?width=150&height=150&random=${randomNum}`;
                img.alt = "Kitty Image";
                img.className = "rounded-xl mb-2";

                const label = document.createElement("p");
                label.className = liked ? "text-green-500 font-semibold" : "text-red-500 font-semibold";
                label.textContent = liked ? "Liked" : "Unliked";

                card.appendChild(img);
                card.appendChild(label);

                if (liked) {
                    likedContainer.appendChild(card);
                } else {
                    unlikedContainer.appendChild(card);
                }
            });

        }

    }, 800);

    setTimeout(() => {
        container3.classList.remove("hidden");
    }, 2000);
});
