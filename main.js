document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    initHelpModal();

    let guessedWords = [
        []
    ];
    let availableSpace = 1;

    let word = "dairy";
    const wordArr = word.split("");
    let guessedWordCount = 0;

    let wordCompleteDelete = 0;
    let backgroundColorExists;
    let gameComplete = false;
    var checkingInProcess = false;

    const keys = document.querySelectorAll(".keyboard-row button");

    statsModal();

    function initHelpModal() {
        const modal = document.getElementById("help-modal");

        // Get the button that opens the modal
        const btn = document.getElementById("help");

        // Get the <span> element that closes the modal
        const span = document.getElementById("close-help");

        // When the user clicks on the button, open the modal
        btn.addEventListener("click", function() {
            modal.style.display = "block";
        });

        // When the user clicks on <span> (x), close the modal
        span.addEventListener("click", function() {
            modal.style.display = "none";
        });

        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener("click", function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }

    function statsModal() {
        const statsModal = document.getElementById("stats-modal");
        const span = document.getElementById("close-stats");;

        span.addEventListener("click", function() {
            statsModal.style.display = "none";
        });

        window.addEventListener("click", function(event) {
            if (event.target == statsModal) {
                statsModal.style.display = "none";
            }
        });


        const sorryMsg = document.getElementById("sorry");
        sorryMsg.textContent += word;
        statsModal.style.display = "block";
    }





    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));

            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;

        }
    }

    function fixTileColor(currentWordArr) {
        var tileColorArr = new Array();
        var indexToBeRemovedOnWord = new Array();
        const wordArr = word.split("");
        currentWordArr.forEach((letter, index) => {
            const isCorrectLetter = word.includes(letter);
            if (!isCorrectLetter) {
                tileColorArr.push([index, "rgb(58, 58, 60)"]);
                currentWordArr[index] = 0;
            }

            const letterInThatPosition = word.charAt(index);
            const isCorrectPosition = letter === letterInThatPosition;

            if (isCorrectPosition) {
                tileColorArr.push([index, "rgb(83, 141, 78)"]);
                currentWordArr[index] = 0;
                indexToBeRemovedOnWord.push(index);
            }

        });

        while (indexToBeRemovedOnWord.length) {
            wordArr.splice(indexToBeRemovedOnWord.pop(), 1);
        }
        const z = wordArr.join("");
        currentWordArr.forEach((letter, index) => {
            if (letter) {
                var isCorrectLetter2 = z.includes(letter);

                if (!isCorrectLetter2) {
                    tileColorArr.push([index, "rgb(58, 58, 60)"]);
                } else {
                    tileColorArr.push([index, "rgb(181, 159, 59)"]);
                }
            }
        });
        return tileColorArr;
    }

    function handleSubmitWord() {

        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
        } else if (currentWordArr.length == 5) {
            checkingInProcess = true;
            setTimeout(() => { checkingInProcess = false; }, 1200);

            const currentWord = currentWordArr.join("");

            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 200;
            const tileColorArr = fixTileColor(currentWordArr);

            for (var i = 0; i < tileColorArr.length; i++) {
                const tileColor = tileColorArr[i][1];
                const letterId = firstLetterId + tileColorArr[i][0];
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flip");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;

            }

            guessedWordCount += 1;

            if (currentWord === word) {

                // const congrats = document.querySelector("[data-key='enter']");
                const sorryMsg = document.getElementById("sorry");
                const statsModal = document.getElementById("stats-modal");
                statsModal.style.display = "block";
                sorryMsg.style.display = "none";

                gameComplete = true;
            }

            if (guessedWords.length === 6) {
                const congratsMsg = document.getElementById("congrats");
                const statsModal = document.getElementById("stats-modal");
                statsModal.style.display = "block";
                congratsMsg.style.display = "none";
                gameComplete = true;
            }

            guessedWords.push([]);

        }
    }


    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1));

        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;

    }

    for (let i = 0; i < keys.length; i++) {

        keys[i].onclick = ({ target }) => {

            if (!gameComplete && !checkingInProcess) {
                const letter = target.getAttribute("data-key");
                if (availableSpace !== 1) {
                    backgroundColorExists = document.getElementById(availableSpace - 1).style.backgroundColor;
                }

                if (letter === "enter") {
                    handleSubmitWord();
                    return;
                }

                if (letter === "del") {
                    if (!backgroundColorExists) {
                        handleDeleteLetter();
                    }
                    return;
                }

                updateGuessedWords(letter);
            }
        };
    }
});