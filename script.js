document.getElementById("submit").addEventListener("click", async function () {
    const name = document.getElementById("name").value.trim();
    const container1 = document.getElementById("container");
    const container2 = document.getElementById("container2");
    const container3 = document.getElementById("container3");
    const container4 = document.getElementById("container4");
    const welcome = document.getElementById("welcome");
    const errorMsg = document.getElementById("errorMsg");

    if (name === "") {
        errorMsg.classList.remove("hidden");
        return;
    }
    errorMsg.classList.add("hidden");

    container1.classList.remove("animate-fade-up");
    container1.classList.add("animate-fade-up-exit");

    setTimeout(async () => {
        container1.classList.add("hidden");
        welcome.textContent = `Welcome, ${name} !`;
        container2.classList.remove("hidden");

        const kittyContainer = document.getElementById("kittyContainer");
        kittyContainer.innerHTML = "";

        const maxMove = 50;
        const totalCats = 10;
        let currentCatIndex = 0;
        const catMap = new Map();
        let cuteCats = [];
        const usedCats = new Set();

        async function fetchCuteCats() {
            try {
                const response = await fetch("https://cataas.com/api/cats?tags?");
                const data = await response.json();
                cuteCats = data;
            } catch (err) {
                console.error("Failed to fetch cats:", err);
            }
        }

        function getContainerSize() {
            return window.innerWidth >= 1024 ? 300 : 250;
        }

        async function loadNewCat() {
            kittyContainer.innerHTML = "";

            const containerSize = getContainerSize();

            const loadingText = document.createElement("p");
            loadingText.textContent = "Loading ...";
            loadingText.className =
                "rounded-2xl opacity-100 animate-pulse text-gray-500 font-semibold flex lg:text-lg items-center justify-center";
            loadingText.style.width = containerSize + "px";
            loadingText.style.height = containerSize + "px";
            loadingText.style.display = "flex";
            loadingText.style.alignItems = "center";
            loadingText.style.justifyContent = "center";
            kittyContainer.appendChild(loadingText);

            let cat;
            try {
                const response = await fetch("https://cataas.com/cat?json=true");
                cat = await response.json();
            } catch (err) {
                console.error("Failed to fetch cat:", err);
                kittyContainer.innerHTML = `<p class="text-gray-600 text-center">Failed to load kitty !</p>`;
                return;
            }

            usedCats.add(cat.id);

            const img = document.createElement("img");
            img.src = `https://cataas.com/cat/${cat.id}?width=${containerSize}&height=${containerSize}`;
            img.alt = "Kitty Image";
            img.className =
                "rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 cursor-pointer select-none";
            img.style.width = containerSize + "px";
            img.style.height = containerSize + "px";
            img.style.position = "relative";
            img.style.transition = "left 0.3s ease, opacity 0.3s ease";
            img.style.opacity = "0";
            img.style.display = "block";
            img.style.margin = "0 auto";

            img.onload = () => {
                kittyContainer.innerHTML = "";
                kittyContainer.appendChild(img);
                setTimeout(() => (img.style.opacity = "1"), 50);
                setupKittyInteractions(img, cat.id);
            };

            img.onerror = () => {
                kittyContainer.innerHTML = `<p class="text-gray-600 text-center">Failed to load kitty !</p>`;
            };
        }


        window.addEventListener("resize", () => {
            const img = kittyContainer.querySelector("img");
            const loadingText = kittyContainer.querySelector("p");

            if (img) {
                const containerSize = getContainerSize();
                img.style.width = containerSize + "px";
                img.style.height = containerSize + "px";
            }

            if (loadingText) {
                const containerSize = getContainerSize();
                loadingText.style.width = containerSize + "px";
                loadingText.style.height = containerSize + "px";
            }

            const imgs = container4.querySelectorAll("img");
            imgs.forEach((img) => {
                const size = getResultImageSize();
                img.style.width = size + "px";
                img.style.height = size + "px";
                const url = new URL(img.src);
                url.searchParams.set("width", size);
                url.searchParams.set("height", size);
                img.src = url.toString();
            });
        });

        function setupKittyInteractions(img, catId) {
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
                    container3.style.boxShadow = "0 0 50px rgba(0, 254, 64, 1)";
                    catMap.set(catId, true);
                    fadeAndNextCat();
                } else if (offset <= -maxMove) {
                    container3.style.boxShadow = "0 0 50px rgba(255, 0, 0, 0.8)";
                    catMap.set(catId, false);
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

        function getResultImageSize() {
            return window.innerWidth >= 1024 ? 150 : 100;
        }

        function showResults() {
            container3.classList.remove("animate-fade-up");
            container3.classList.add("animate-fade-up-exit");

            setTimeout(() => {
                container3.classList.add("hidden");
                container4.classList.remove("hidden");
            }, 2000);

            const likedContainer = document.getElementById("resultLikedContainer");
            const unlikedContainer = document.getElementById("resultUnlikedContainer");

            likedContainer.innerHTML = "";
            unlikedContainer.innerHTML = "";

            let hasLiked = false;
            let hasUnliked = false;

            catMap.forEach((liked, catId) => {
                const card = document.createElement("div");
                card.className = "flex flex-col items-center bg-white rounded-xl p-3 cursor-pointer";
                card.style.boxShadow = liked
                    ? "0 0 20px rgba(146, 255, 173, 1)"
                    : "0 0 20px rgba(254, 127, 127, 0.8)";
                card.style.transition = "box-shadow 0.3s ease";

                card.addEventListener("mouseenter", () => {
                    card.style.boxShadow = liked
                        ? "0 0 60px rgba(146, 255, 173, 1)"
                        : "0 0 60px rgba(254, 127, 127, 0.8)";
                });

                card.addEventListener("mouseleave", () => {
                    card.style.boxShadow = liked
                        ? "0 0 20px rgba(146, 255, 173, 1)"
                        : "0 0 20px rgba(254, 127, 127, 0.8)";
                });

                const img = document.createElement("img");
                const size = getResultImageSize();
                img.src = `https://cataas.com/cat/${catId}?width=${size}&height=${size}`;
                img.alt = "Kitty Image";
                img.style.width = size + "px";
                img.style.height = size + "px";
                img.className = "rounded-xl mb-2 text-md";

                card.addEventListener("click", () => {
                    window.open(`https://cataas.com/cat/${catId}?width=${size}&height=${size}`);
                });

                const label = document.createElement("p");
                label.className = liked ? "text-green-500" : "text-red-500";
                label.textContent = liked ? "Liked" : "Unliked";

                card.appendChild(img);
                card.appendChild(label);

                if (liked) {
                    likedContainer.appendChild(card);
                    hasLiked = true;
                } else {
                    unlikedContainer.appendChild(card);
                    hasUnliked = true;
                }
            });

            if (!hasLiked) {
                likedContainer.innerHTML = `<p class="text-green-500 text-lg font-semibold">You loved all the kitties!</p>`;
            }
            if (!hasUnliked) {
                unlikedContainer.innerHTML = `<p class="text-red-500 text-lg font-semibold">You disliked kitties!</p>`;
            }
        }

        await loadNewCat();

    }, 800);

    setTimeout(() => {
        container3.classList.remove("hidden");
    }, 2000);

});

document.getElementById("tryagain").addEventListener("click", async function () {

    location.reload();

});
