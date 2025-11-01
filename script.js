// Submit the name
document.getElementById("submit").addEventListener("click", async function () {

    // Declare variables from HTML id
    const name = document.getElementById("name").value.trim();
    const container1 = document.getElementById("container");
    const container2 = document.getElementById("container2");
    const container3 = document.getElementById("container3");
    const container4 = document.getElementById("container4");
    const welcome = document.getElementById("welcome");
    const errorMsg = document.getElementById("errorMsg");
    const kittyContainer = document.getElementById("kittyContainer");

    //Check name is require
    if (name === "") {
        errorMsg.classList.remove("hidden");
        return;
    }
    errorMsg.classList.add("hidden");

    //Container 1 animation is changing when name is inserted
    container1.classList.remove("animate-fade-up");
    container1.classList.add("animate-fade-up-exit");

    //Load all the functions in 0.8 seconds
    setTimeout(async () => {

        // Container 1 and 2 is changing their hidden style
        container1.classList.add("hidden");
        welcome.textContent = `Welcome, ${name} !`;
        container2.classList.remove("hidden");

        // Let the kittyContainer become empty first
        kittyContainer.innerHTML = "";

        // Let the image just can move 50px
        const maxMove = 50;

        // Total cats will be display
        const totalCats = 10;

        // Current index for cat
        let currentCatIndex = 0;

        // Map the cat into (id, true or false)
        const catMap = new Map();

        // Let the cats is different id;
        const usedCats = new Set();

        // Main Function to display different cats 
        async function loadNewCat() {

            // Let the kittyContainer become empty at first and repeat when swapped the previous cat
            kittyContainer.innerHTML = "";

            // Declare for the container size from getContainerSize function
            const containerSize = getContainerSize();

            // Create a new p for Loading...
            const loadingText = document.createElement("p");
            loadingText.textContent = "Loading ...";
            loadingText.className =
                "rounded-2xl opacity-100 animate-pulse text-gray-500 font-semibold flex lg:text-lg items-center justify-center";
            loadingText.style.width = containerSize + "px";
            loadingText.style.height = containerSize + "px";
            loadingText.style.display = "flex";
            loadingText.style.alignItems = "center";
            loadingText.style.justifyContent = "center";

            // Send p to the kittyContainer id in Html page 
            kittyContainer.appendChild(loadingText);

            //Declare the empty cat first
            let cat;
            try {

                // Get the cats data from https://cataas.com/cat?json=true
                const response = await fetch("https://cataas.com/cat?json=true");

                // Reads the response in json format and store in cat variable
                cat = await response.json();

                // Get error if cats data is failed fetch.
            } catch (err) {

                // Display the error message when get error from cat data
                console.error("Failed to fetch cat:", err);
                kittyContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load kitty !</p>`;
                return;
            }

            // Get the cat id after get cat data successfully
            usedCats.add(cat.id);

            // create a new image for cat
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

            // Load the image 
            img.onload = () => {

                // Let the kittyContainer empty to empty the Loading .. p
                kittyContainer.innerHTML = "";

                // Send img to the kittyContainer id in Html page 
                kittyContainer.appendChild(img);

                // Let the image in fade effect in 0.05 seconds
                setTimeout(() => (img.style.opacity = "1"), 50);

                // run the setupKittyInteraction by passing image and cat id
                setupKittyInteractions(img, cat.id);
            };

            // Get error if imag display fail
            img.onerror = () => {
                kittyContainer.innerHTML = `<p class="text-gray-600 text-center">Failed to load kitty !</p>`;
            };
        }

        // Function to change the size container when screen is changing
        function getContainerSize() {
            return window.innerWidth >= 1024 ? 300 : 250;
        }

        //resize the kittyContainer where img == loadingText
        window.addEventListener("resize", () => {

            //Get img/p element and store in img/loadingText
            const img = kittyContainer.querySelector("img");
            const loadingText = kittyContainer.querySelector("p");

            // if img exist, set the getContainerSize function into img
            if (img) {
                const containerSize = getContainerSize();
                img.style.width = containerSize + "px";
                img.style.height = containerSize + "px";
            }

            // if loadingText exist, set the getContainerSize function into loadingText
            if (loadingText) {
                const containerSize = getContainerSize();
                loadingText.style.width = containerSize + "px";
                loadingText.style.height = containerSize + "px";
            }

            // Get all the img element and store in imgs
            const imgs = container4.querySelectorAll("img");
            imgs.forEach((img) => {
                img.style.width = size + "px";
                img.style.height = size + "px";

                // Set each img have their own url
                const url = new URL(img.src);
                url.searchParams.set("width", size);
                url.searchParams.set("height", size);
                img.src = url.toString();
            });
        });

        // Function to make the cat image swipe to right or let according to each of cat id
        function setupKittyInteractions(img, catId) {

            // Declare "following" which is following the mouse direction
            let following = false;
            // Declare "moveKitty" which is to move the kitty image
            let moveKitty = null;

            // Select the image when click by mouse
            img.addEventListener("click", () => {

                // following is set true and change the img shadow
                if (!following) {
                    following = true;
                    img.classList.add("shadow-[0_0_30px_rgba(59,130,246,0.8)]");

                    // when click, moveKitty is hanle the image moving
                    moveKitty = (e) => handleMove(e.clientX);

                    //mousemove is use for pc and touchmove is for mobile to move the image
                    document.addEventListener("mousemove", moveKitty);
                    document.addEventListener("touchmove", onTouchMove);

                    // If not stop following the mouse
                } else stopFollowing();
            });

            // Function to move the cat image by following mouse direction x-axis (clientX)
            function handleMove(clientX) {

                // Get the size and direction from kittyContainer
                const containerRect = kittyContainer.getBoundingClientRect();

                // Find the mouse direction when clientx - containerRect.left, Example the mouseX is left side when clientx - containerRect.left = 0
                const mouseX = clientX - containerRect.left;

                // Find the center direction when container.Rect.width / 2
                const center = containerRect.width / 2;

                // Find how far the mouseX from center direction 
                let offset = mouseX - center;

                // limit it range between -maxMove - maxMove
                offset = Math.max(-maxMove, Math.min(maxMove, offset));

                // Set always in positive
                const distance = Math.abs(offset);

                // Set the minimum opacity with 30%
                const minOpacity = 0.3;

                // Set the opcity according to distance / maxMove
                const opacity = 1 - (distance / maxMove) * (1 - minOpacity);

                // Apply opacity 
                img.style.opacity = opacity;

                // Add rotation effect with  maximum 10 rotation
                const maxRotation = 10;
                const rotation = (offset / maxMove) * maxRotation;

                // Apply the transform with offset and rotation
                img.style.transform = `translateX(${offset}px) rotate(${rotation}deg)`;

                //Change the shadow for container 3 according to offset and maxMove which is right is green "Liked" and left is red "Disliked"
                // Set the catMap with id and true or false
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

            // Function to use finger to handle the image move
            function onTouchMove(e) {

                //Detect if having a finger is controlled and move x position in handleMove (similiar like mouse)
                if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
            }

            //Function to display next Cat image
            function fadeAndNextCat() {

                // Remove moveKitty and onTouchMove
                document.removeEventListener("mousemove", moveKitty);
                document.removeEventListener("touchmove", onTouchMove);

                // Trasition into opcacity in 0.6 seconds and set following into false
                img.style.transition = "opacity 0.6s ease";
                img.style.opacity = "0";
                following = false;

                // Set time to load new cat image by current cat index < total cats, else show result when cat index = total cats
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

            // When mouseup and touchend, stopFollowing function is run
            document.addEventListener("mouseup", stopFollowing);
            document.addEventListener("touchend", stopFollowing);

            // Function to stop following the mouse direction
            function stopFollowing() {

                // Let the following become false
                following = false;
                // Remove the moveKitty and onTouchMove function when stopFollowing function is run
                document.removeEventListener("mousemove", moveKitty);
                document.removeEventListener("touchmove", onTouchMove);

                // Let the image set as default
                img.style.transition = "all 0.5s ease";
                img.style.transform = "translateX(0px) rotate(0deg)";
                img.style.opacity = "1";
                img.classList.remove("shadow-[0_0_30px_rgba(59,130,246,0.8)]");
                container3.style.boxShadow = "0 0 25px rgba(255,255,255,0.8)";
            }
        }

        // function to set the image size in the showResult function
        function getResultImageSize() {
            return window.innerWidth >= 1024 ? 150 : 100;
        }

        // Function to show result
        function showResults() {

            // Container 3 animation is change
            container3.classList.remove("animate-fade-up");
            container3.classList.add("animate-fade-up-exit");

            // Container 3 is hide and Container 4 is remove hidden
            setTimeout(() => {
                container3.classList.add("hidden");
                container4.classList.remove("hidden");
            }, 2000);

            // Declare variables from HTML id
            const likedContainer = document.getElementById("resultLikedContainer");
            const unlikedContainer = document.getElementById("resultUnlikedContainer");

            // Set the variable in empty and false
            likedContainer.innerHTML = "";
            unlikedContainer.innerHTML = "";
            let hasLiked = false;
            let hasUnliked = false;

            // Use catMap to arrange cats
            catMap.forEach((liked, catId) => {

                // Create new card
                const card = document.createElement("div");
                card.className = "flex flex-col items-center bg-white rounded-xl p-3 cursor-pointer";

                // Make green shadow when image is liked, red shadow when image is unliked
                card.style.boxShadow = liked
                    ? "0 0 20px rgba(146, 255, 173, 1)"
                    : "0 0 20px rgba(254, 127, 127, 0.8)";
                card.style.transition = "box-shadow 0.3s ease";

                // Make more color for shadow when image is hovered
                card.addEventListener("mouseenter", () => {
                    card.style.boxShadow = liked
                        ? "0 0 60px rgba(146, 255, 173, 1)"
                        : "0 0 60px rgba(254, 127, 127, 0.8)";
                });

                // Make default shadow when image is left hover
                card.addEventListener("mouseleave", () => {
                    card.style.boxShadow = liked
                        ? "0 0 20px rgba(146, 255, 173, 1)"
                        : "0 0 20px rgba(254, 127, 127, 0.8)";
                });

                // Create new img for each cat
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

                // Create new label for each cat wheather is liked or Unliked
                const label = document.createElement("p");
                label.className = liked ? "text-green-500" : "text-red-500";
                label.textContent = liked ? "Liked" : "Unliked";

                // Set img and label in card
                card.appendChild(img);
                card.appendChild(label);

                // When liked is true, card will display in likeContainer, else unlikedContainer
                if (liked) {
                    likedContainer.appendChild(card);
                    hasLiked = true;
                } else {
                    unlikedContainer.appendChild(card);
                    hasUnliked = true;
                }
            });

            // if hasLike is false, likedContainer will display "You loved all the kitties!"
            if (!hasLiked) {
                likedContainer.innerHTML = `<p class="text-green-500 text-lg font-semibold p-5">You loved all the kitties!</p>`;
            }

            // if hasUnlike is false, unlikedContainer will display "You disliked kitties!"
            if (!hasUnliked) {
                unlikedContainer.innerHTML = `<p class="text-red-500 text-lg font-semibold p-5">You disliked kitties!</p>`;
            }
        }

        // Run and wait loadNewCat function until end
        await loadNewCat();

    }, 800);

    // Set delay time to remove Container 3 hidden 
    setTimeout(() => {
        container3.classList.remove("hidden");
    }, 2000);

});

// Reload the page
document.getElementById("tryagain").addEventListener("click", async function () {

    location.reload();

});
