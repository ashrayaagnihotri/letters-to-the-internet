const terminal = document.getElementById("terminal");
let currentLine = "";
let isDarkTheme = false;
let keyListener = null;
let bgMusic = null;
let commandHistory = [];
let historyIndex = -1;

const questions = [
    {
        question: "Q1\nWhat comes first in a sandwich: bread or feelings?",
        answer: "feelings",
        hint: "Be honest.",
        content: "Letter 1 — About Me 💁‍♀️:\nHey there,\n\nI’m Ashraya — a final-year engineering student at SRM Institute of Science and Technology, Kattankulathur. I come from Lucknow, a city rich in culture, art, and history. The food is unforgettable, the winters are the kind that make you slow down and take a breath, and the old-world charm of the city has definitely shaped a quiet softness in the way I see things.\n\nOn the tech side — I’ve worked with the MERN stack, SQL, and explored a bit of AI/ML. Right now, I’m diving deeper into other JavaScript frameworks and always trying to build things that are not just functional but feel good to interact with.\n\nOutside of code, I love watching movies, reading, and occasionally experimenting with new recipes — some successful, others... character-building.\n\nAlso, if I ever seem quiet in a crowd, it’s probably because I’m silently rehearsing how to say “Hi” without making it weird — chronic social anxiety, truly the main character in most of my interactions.\n\nWarmly (but still slightly awkwardly),\nAshraya"
      },
  {
    question: "Q2\nWhat day of the week do most people *pretend* to be productive? ☕",
    answer: "monday",
    hint: "Starts the workweek. You know the one everyone complains about.",
    content: "Letter 2 — Projects 💻:\n1) Short-Stay Accommodation Network:\nA full-stack web application built using Node.js, Express, and MongoDB, with vanilla JS for the frontend. It features secure user authentication, RESTful APIs, and Docker-based containerization to ensure scalability and smooth deployment.\n\n2) Soil Analysis and Crop Yield Prediction:\nA machine learning project using Random Forest, SVM, and ANN to analyze soil properties and predict crop yields. Handled large datasets to deliver accurate, reliable forecasts with a focus on real-world applicability.\n\nAnd of course, a few more — but we’ll save those for another time."
  },
  {
    question: "Q3\nName the boy who lived — the most famous young wizard in the magical world.",
answer: "harry potter",
hint: "You *have* heard of Harry Potter... right? If not, I am judging (gently).",
    content: "Letter 3 — Experience 🛠️:\nI'm currently interning at DRDO, IRDE Dehradun, as part of a six-month research project. Working directly under a senior scientist has been an incredibly valuable experience — I've been learning about detection systems, lasers, radar and LiDAR technologies, while also exploring MATLAB and GUI development. It's a challenging and hands-on opportunity that’s giving me a deeper understanding of real-world tech and research environments."
  },
  {
    question: "Q4\nDo we like Ashraya so far?",
answer: "yes",
hint: "Careful. That didn’t sound like a ‘yes’. Try again before I take it personally.",
content: "Letter 4 — Highlights 💼:\n1. Served as the Content Team Lead in the Student Council at SRM, overseeing official communications and coordinating content across multiple college events.\n\n2. An active member of the MUN Society, participating in various conferences and enhancing research, diplomacy, and public speaking skills.\n\n3. Participated in several hackathons, securing a runner-up position in few — gaining hands-on experience in time-bound problem solving and teamwork.\n\nThere’s always more in the making — but these are a few I hold close."

  },
  {
    question: "Q5\nWhat do we call this fun little interface you’ve been chatting with?",
    answer: "terminal",
    hint: "It’s me. The terminal. I’m disappointed. I have feelings too.",
    content: `Letter 5 — Contact 📬:\nYou've reached the final letter.

Thank you for taking the time to explore this little terminal portfolio — it truly means a lot. If you'd like to connect, collaborate, or just say hi, here’s how you can reach me:

Mail: ashrayaagnihotri.10@gmail.com
LinkedIn: https://www.linkedin.com/in/ashraya-agnihotri-880803206/

Wishing you a lovely rest of your day — and thank you again for stopping by.`
  }
];

const commands = {
    help: () => `Available commands:
    help       See all available commands
    clear      Clear the terminal screen
    letters    A tiny quiz to get to know me better
    resume     View Ashraya’s resume
    contact    Get in touch
    whoami     Ashraya, at a glance
    theme      Switch between light and dark mode
    exit       Leave the terminal`,
  

  clear: () => {
    terminal.innerHTML = "";
    showWelcome();
    return "";
  },

  exit: () => {
    appendLine("Trying to leave already?");
    appendLine("Just kidding — you can close this tab now. See you around");
    return "";
  },

  resume: () => {
    window.open("https://drive.google.com/file/d/1_iyoG3bFQ6VPoNZmV5UDrR1xwMO4b9xa/view?usp=sharing", "_blank");
    return "Opening Ashraya's resume";
  },

  whoami: () => `
🙋‍♀️ Full Name: Ashraya Agnihotri  
🎂 Age: 21  
📏 Height: 5'4"  
👓 Wears glasses (but avoids them when possible)  
🙇‍♀️ Quietly shy, especially in new settings  
🧠 Quick and adaptive learner  
🔁 Tends to overthink — detail-oriented by default    
📘 Observant and a thoughtful listener  
`,

contact: () => `
Email:    ashrayaagnihotri.10@gmail.com  
LinkedIn: https://www.linkedin.com/in/ashraya-agnihotri-880803206/  
GitHub:   https://github.com/ashrayaagnihotri
`,


  theme: () => {
    document.body.classList.toggle("dark-mode");
    isDarkTheme = !isDarkTheme;
    return `Switched to ${isDarkTheme ? "dark" : "light"} mode 🌗`;
  },

  letters: () => {
    appendLine("\n✉️  Welcome to \"Letters to the Internet\"");
    appendLine("This is a simple, interactive way to get to know Ashraya better.\n");
    appendLine("She’s written 5 short letters — each one shares something different about her.");
    appendLine("  1. About Me\n  2. Projects\n  3. Experience\n  4. Highlights\n  5. Contact \n");
    appendLine("To unlock them, just answer a few questions. Nothing tricky, promise!\n");
    appendLine("Would you like some music while we go through them? (yes / no)\n");
    waitForMusicChoice();
    return "";
  },  

  sudo: () => `🛑 Access denied. You thought a little 'sudo' would work here? This isn't your terminal, buddy — only Ashraya gets root privileges. Nice try though.`,

};

function appendLine(text = "", className = "") {
    const line = document.createElement("div");
    if (className) line.className = className;
    line.innerText = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    scrollPageToBottom(); 
  }
  

function createKeyListener(callback) {
  return function (e) {
    if (e.key === "Enter") {
      window.removeEventListener("keydown", keyListener);
      keyListener = null;

      const input = currentLine.trim();
      commandHistory.push(input);
      historyIndex = commandHistory.length;

      callback(input.toLowerCase());
    } else if (e.key === "Backspace") {
      currentLine = currentLine.slice(0, -1);
    } else if (e.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex--;
        currentLine = commandHistory[historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        currentLine = commandHistory[historyIndex] || "";
      } else {
        currentLine = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const suggestions = Object.keys(commands).filter(cmd =>
        cmd.startsWith(currentLine)
      );
      if (suggestions.length === 1) {
        currentLine = suggestions[0];
      }
    } else if (e.key.length === 1) {
      currentLine += e.key;
    }

    const inputLine = document.querySelector(".input-line .user-input");
    if (inputLine) inputLine.textContent = currentLine;
  };
}

function waitForCommand() {
  if (keyListener) return;

  const inputLine = document.createElement("div");
  inputLine.className = "input-line";
  inputLine.innerHTML = '<span class="prompt">user@yourstrulyashraya &gt; </span><span class="user-input"></span>';
  terminal.appendChild(inputLine);

  currentLine = "";

  keyListener = createKeyListener((command) => {
    const pastLine = document.createElement("div");
    pastLine.className = "past-line";
    pastLine.innerHTML = `<span class="prompt">user@yourstrulyashraya &gt; </span>${command}`;
    terminal.replaceChild(pastLine, inputLine);

    if (["hi", "hello", "hey"].includes(command)) {
      appendLine("\nHi again! 🌼 Restarting the terminal...\n");
      setTimeout(() => {
        terminal.innerHTML = "";
        showWelcome();
      }, 1000);
      return;
    }

    const response = commands[command] ? commands[command]() : "Unknown command.";
    if (response) appendLine("\n" + response + "\n");

    waitForCommand();
  });

  window.addEventListener("keydown", keyListener);
}

function waitForMusicChoice() {
  const inputLine = document.createElement("div");
  inputLine.className = "input-line";
  inputLine.innerHTML = '<span class="prompt">user@yourstrulyashraya &gt; </span><span class="user-input"></span>';
  terminal.appendChild(inputLine);

  currentLine = "";

  keyListener = createKeyListener((answer) => {
    const pastLine = document.createElement("div");
    pastLine.className = "past-line";
    pastLine.innerHTML = `<span class="prompt">user@yourstrulyashraya &gt; </span>${answer}`;
    terminal.replaceChild(pastLine, inputLine);

    bgMusic = document.getElementById("bg-music");
    if (answer === "yes") {
      appendLine("\nA little music to keep things light. Hope you like it.\n");
      if (bgMusic) bgMusic.play();
    } else {
      appendLine("\nNo music? Alright, raw vibes only. Respect.\n");
    }
    appendLine("Type 'okay' when you're ready to begin.");
    waitForOkayCommand();
  });

  window.addEventListener("keydown", keyListener);
}

function waitForOkayCommand() {
  const inputLine = document.createElement("div");
  inputLine.className = "input-line";
  inputLine.innerHTML = '<span class="prompt">user@yourstrulyashraya &gt; </span><span class="user-input"></span>';
  terminal.appendChild(inputLine);

  currentLine = "";

  keyListener = createKeyListener((answer) => {
    const pastLine = document.createElement("div");
    pastLine.className = "past-line";
    pastLine.innerHTML = `<span class="prompt">user@yourstrulyashraya &gt; </span>${answer}`;
    terminal.replaceChild(pastLine, inputLine);

    if (answer === "okay") {
      appendLine("\nLet's begin!\n");
      askQuestion(0);
    } else {
      appendLine("No rush. But hey, I was kinda built for this moment.\n");
      waitForOkayCommand();
    }
  });

  window.addEventListener("keydown", keyListener);
}
function askQuestion(index) {
    if (index >= questions.length) {
      appendLine("\n🎉 You’ve made it through all of Ashraya’s letters — thanks for sticking around. Hope you enjoyed the ride!\n");
      runConfetti();
      waitForCommand();
      return;
    }
  
    appendLine("\n" + questions[index].question);
  
    const inputLine = document.createElement("div");
    inputLine.className = "input-line";
    inputLine.innerHTML = '<span class="prompt">user@yourstrulyashraya &gt; </span><span class="user-input"></span>';
    terminal.appendChild(inputLine);
  
    currentLine = "";
  
    keyListener = createKeyListener((answer) => {
      const pastLine = document.createElement("div");
      pastLine.className = "past-line";
      pastLine.innerHTML = `<span class="prompt">user@yourstrulyashraya &gt; </span>${answer}`;
      terminal.replaceChild(pastLine, inputLine);
  
      const cleaned = answer.trim().toLowerCase();
  
      // Special commands handling
      if (["exit", "quit"].includes(cleaned)) {
        appendLine("\nSee you next time!\n");
        waitForCommand();
        return;
      }
  
      if (cleaned === "clear") {
        terminal.innerHTML = "";
        showWelcome();
        return;
      }
  
      // Correct answer
      if (cleaned === questions[index].answer) {
        appendLine("\n✅ Correct!\n");
        showLetterWithStyle(questions[index].content, () => {
          askQuestion(index + 1);
        });
      } else {
        appendLine("❌ Hmm, not quite! Here's a hint: " + questions[index].hint);
        askQuestion(index);
      }
    });
  
    window.addEventListener("keydown", keyListener);
  }  
  

function runConfetti() {
  const duration = 4 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: {
        x: randomInRange(0.1, 0.9),
        y: Math.random() - 0.2
      }
    }));
  }, 250);
}

function typeWelcome(text, callback) {
  const welcomeLine = document.createElement("div");
  terminal.appendChild(welcomeLine);

  let i = 0;
  function typeChar() {
    if (i < text.length) {
      welcomeLine.innerText += text.charAt(i);
      i++;
      setTimeout(typeChar, 15);
    } else if (callback) {
      callback();
    }
  }
  typeChar();
}
function showLetterWithStyle(text, callback) {
    const loadingLine = document.createElement("div");
    loadingLine.className = "loading-line";
    loadingLine.innerText = "Letter loading...";
    terminal.appendChild(loadingLine);
  
    setTimeout(() => {
      loadingLine.remove();
  
      const lines = text.split("\n");
      let i = 0;
  
      function typeNextLine() {
        if (i < lines.length) {
          const line = document.createElement("div");
  
          // Add bold style for first line (the letter title)
          if (i === 0) {
            line.className = "letter-line letter-title";
          } else {
            line.className = "letter-line";
          }
  
          terminal.appendChild(line);
  
          let j = 0;
          function typeChar() {
            if (j < lines[i].length) {
              line.textContent += lines[i].charAt(j);
              j++;
              setTimeout(typeChar, 15);
            } else {
              i++;
              setTimeout(typeNextLine, 250);
            }
          }
  
          typeChar();
          terminal.scrollTop = terminal.scrollHeight;
        } else {
          if (callback) callback();
        }
      }
  
      typeNextLine();
    }, 1500);
  }
  
  function showWelcome() {
    const welcome = `Welcome to Ashraya’s Terminal Portfolio ✨
  
  A playful way to explore her work, projects, and experience —
  built with code, care, and a touch of curiosity.
  
  For a list of available commands, type \`help\`.`;
    typeWelcome(welcome, waitForCommand);
  }
  
function scrollPageToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
  
showWelcome();
