// --- MINOR EASTER EGG: THE DEV CONSOLE ---
console.log(
    "%c🇵🇭 Mabuhay, Kabayan! %c\n\nYou found the secret developer console. \nAwareness is the first step to a better nation. \nKeep exploring!", 
    "color: #0038A8; font-size: 20px; font-weight: bold;", 
    "color: #CE1126; font-size: 14px;"
);

// --- SHARED DATA: Content for Gov 101 ---
const branchData = {
    executive: {
        title: "Executive Branch",
        subtitle: "The Enforcer",
        description: "The Executive branch carries out and enforces laws. It includes the President, Vice President, the Cabinet, and various executive departments.",
        powers: [
            "Command-in-Chief of the Armed Forces",
            "Power to veto bills passed by Congress",
            "Appoints heads of executive departments (Cabinet members)",
            "Grants reprieves, commutations, and pardons"
        ]
    },
    legislative: {
        title: "Legislative Branch",
        subtitle: "The Lawmaker",
        description: "The Legislative branch is authorized to make laws, alter, and repeal them through the power vested in the Philippine Congress.",
        powers: [
            "Power of the Purse (Deciding the national budget)",
            "Power to declare a state of war",
            "Power to impeach high-ranking officials",
            "Ratifies treaties with other nations"
        ]
    },
    judicial: {
        title: "Judicial Branch",
        subtitle: "The Interpreter",
        description: "The Judicial branch interprets the meaning of laws, applies laws to individual cases, and decides if laws violate the Constitution.",
        powers: [
            "Settles actual controversies involving rights",
            "Determines if there has been grave abuse of discretion",
            "Assigns judges to lower courts",
            "Preserves the Rule of Law and the Constitution"
        ]
    }
};

// --- GOV 101 LOGIC ---
const cards = document.querySelectorAll('.clickable-card');
const detailsContainer = document.getElementById('details-container');

// Only run if we are on the Gov 101 page
if (cards.length > 0 && detailsContainer) {
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // 1. Remove active class from all
            cards.forEach(c => c.classList.remove('active'));
            // 2. Add active to this one
            this.classList.add('active');

            const branch = this.getAttribute('data-branch');
            const info = branchData[branch];

            detailsContainer.innerHTML = `
                <div class="fade-in">
                    <h2 style="color:#0038A8; margin-bottom:10px;">${info.title}</h2>
                    <p style="font-weight:bold; color:#CE1126; margin-bottom:15px;">${info.subtitle}</p>
                    <p style="font-size:1.1rem; line-height:1.6; color:#333;">${info.description}</p>
                    <ul style="list-style:none; margin-top:20px;">
                        ${info.powers.map(p => `<li style="margin-bottom:10px;"><i class="fa-solid fa-check" style="color:#0038A8; margin-right:10px;"></i>${p}</li>`).join('')}
                    </ul>
                </div>
            `;
        });
    });
}

// --- HOMEPAGE QUOTE LOGIC ---
const quotes = [
    { text: "The youth is the hope of our fatherland.", author: "Jose Rizal" },
    { text: "I would rather have a government run like hell by Filipinos...", author: "Manuel L. Quezon" },
    { text: "The ballot is stronger than the bullet.", author: "Abraham Lincoln" }
];

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

if (quoteText && quoteAuthor) {
    let currentIndex = 0;
    setInterval(() => {
        quoteText.style.opacity = 0;
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % quotes.length;
            quoteText.textContent = `"${quotes[currentIndex].text}"`;
            quoteAuthor.textContent = `— ${quotes[currentIndex].author}`;
            quoteText.style.opacity = 1;
        }, 500);
    }, 5000);
}

// --- BILL JOURNEY LOGIC ---
const billSteps = [
    {
        title: "Step 1: The Brainstorming",
        desc: "A lawmaker writes the Bill. It’s called 'Filing.' Think of it as submitting your project to the teacher.",
        humor: "Current status: Manifesting na pumasa.",
        icon: "fa-lightbulb",
        progress: "0%"
    },
    {
        title: "Step 2: The Three Readings",
        desc: "The bill is read three times. In between, committees dissect it, argue about it, and change it. If it fails here, it's 'Archived' (aka the Trash Bin).",
        humor: "Bardagulan levels: Very High.",
        icon: "fa-comments",
        progress: "25%"
    },
    {
        title: "Step 3: The Other House",
        desc: "If the House of Representatives likes it, they send it to the Senate (and vice versa). They must both agree on the EXACT same version.",
        humor: "Like trying to get your groupmates to agree on an announcement, seen naman sa GC oh.",
        icon: "fa-paper-plane",
        progress: "50%"
    },
    {
        title: "Step 4: The President's Desk",
        desc: "The President has 3 options: 1. Sign it (It's a Law!), 2. Veto it (Send it back), or 3. Do nothing (It becomes a law after 30 days anyway).",
        humor: "The Final Boss fight.",
        icon: "fa-pen-nib",
        progress: "75%"
    },
    {
        title: "Step 5: Published!",
        desc: "The bill is now a Law. It gets published in the Official Gazette. Now, everyone must follow it, or face the consequences!",
        humor: "Final status: Pasado! Libre naman diyan!",
        icon: "fa-gavel",
        progress: "100%"
    }
];

let currentStep = 0;

const stepTitle = document.getElementById('step-title');
const stepDesc = document.getElementById('step-desc');
const stepHumor = document.getElementById('step-humor');
const stepIcon = document.querySelector('.journey-icon i');
const progressFill = document.getElementById('progress-fill');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

function updateJourney() {
    const step = billSteps[currentStep];
    
    // Update Text & Icon
    stepTitle.innerText = step.title;
    stepDesc.innerText = step.desc;
    stepHumor.innerText = `"${step.humor}"`;
    stepIcon.className = `fa-solid ${step.icon}`;
    
    // Update Progress Bar & Dots
    progressFill.style.width = step.progress;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index <= currentStep);
    });

    // Button States
    prevBtn.disabled = currentStep === 0;
    nextBtn.innerText = currentStep === billSteps.length - 1 ? "Start Over" : "Next Step →";
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentStep < billSteps.length - 1) {
            currentStep++;
        } else {
            currentStep = 0;
        }
        updateJourney();
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateJourney();
        }
    });
}

// --- EASTER EGG: The Adobo Secret ---
let clickCount = 0;
const executiveEmoji = document.querySelector('.humor-card:nth-child(1) .humor-emoji');

if (executiveEmoji) {
    executiveEmoji.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            alert("🥇 Achievement Unlocked: You found the Perfect Adobo! (The secret ingredient is Accountability.)");
            executiveEmoji.innerText = "🍲"; // Change emoji to a full pot
            clickCount = 0;
        }
    });
}

// --- EASTER EGG: Blue/Red/Yellow Switcher ---
// Type 'PH' on your keyboard to trigger
let keysPressed = "";
window.addEventListener('keyup', (e) => {
    keysPressed += e.key;
    if (keysPressed.toUpperCase().includes("PH")) {
        document.body.style.border = "10px solid #f1c40f";
        alert("🇵🇭 Mabuhay! You've activated Patriot Mode.");
        keysPressed = ""; // Reset
    }
});

        // --- EASTER EGG: Game Trigger DEBUG VERSION ---
        const gameTrigger = document.getElementById('game-trigger');

        if (gameTrigger) {
            console.log("Ghost Icon found in the code!"); // Test if JS sees the icon

            gameTrigger.addEventListener('click', (e) => {
                console.log("Ghost Icon clicked!"); // Test if click works
                
                // Use an absolute check to see if the file exists
                window.location.href = 'game.html';
            });
        } else {
            console.log("Ghost Icon NOT found. Check your HTML ID!");
        }

// When clicked, scroll to the top
backToTopBtn.onclick = function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
};

// --- MOBILE MENU LOGIC ---
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');
if (menu) {
    menu.addEventListener('click', () => {
        menuLinks.classList.toggle('active');
    });
}