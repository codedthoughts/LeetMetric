document.addEventListener("DOMContentLoaded",function() {
        // Get all the user inputs 
        const searchButton = document.getElementById("search-btn");
        const usernameInput = document.getElementById("user-input");

        //display contents
        const statsContainer = document.querySelector(".stats-container");
        const easyProgressCircle = document.querySelector(".easy-progress");
        const mediumProgressCircle = document.querySelector(".medium-progress");
        const hardProgressCircle = document.querySelector(".hard-progress");
        const easyLabel = document.getElementById("easy-label");
        const mediumLabel = document.getElementById("medium-label");
        const hardLabel = document.getElementById("hard-label");
        const cardStatsContainer = document.querySelector(".stats-cards");

        function validateUsername(username)
        {
            if(username.trim() == "")
            {
                alert("Username should not be empty");
                return false;
            }

            const regex = /^[a-zA-Z0-9 _-]{1,15}$/;
            const isMatching = regex.test(username);
            if(!isMatching) {
            alert("Invalid Username");
            }
            return isMatching;
        }

        function updateProgress(solved,total,label,circle)
        {
            const progressDegree = (solved/total) * 100;
            circle.style.setProperty("--progress-degree",`${progressDegree}%`);
            label.textContent = `${solved}/${total}`;
        }

        function displayUserData(parsedData)
        {
            const totalQues = parsedData.totalQuestions;
            const totalHardQues = parsedData.totalHard;
            const totalEasyQues  = parsedData.totalEasy;
            const totalMediumQues = parsedData.totalMedium;

            const totalSolvedQues = parsedData.totalSolved;
            const totalSolvedHardQues = parsedData.hardSolved;
            const totalSolvedMediumQues = parsedData.mediumSolved;
            const totalSolvedEasyQues = parsedData.easySolved;

            updateProgress(totalSolvedEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
            updateProgress(totalSolvedMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
            updateProgress(totalSolvedHardQues,totalHardQues,hardLabel,hardProgressCircle);

            const cardsData = [
                {label: "AcceptanceRate", value: parsedData.acceptanceRate},
                {label: "Ranking", value: parsedData.ranking},
                {label: "Contribution Points", value : parsedData.contributionPoints},
            ];

            cardStatsContainer.innerHTML = cardsData.map(
                data =>  `
                        <div class="card">
                        <h4>${data.label}</h4>
                        <p>${data.value}</p>
                        <div>
                    `
            ).join("")
            
        }

        async function fetchUserDetails(username)
        {
            const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
            try{

                searchButton.textContent = "Searching...";
                searchButton.disabled = true;

                const response = await fetch(url);
                if(!response.ok)
                {
                    throw new Error("Unable to fetch the User details");
                }
                const parsedData = await response.json();
                console.log("Logging Data", parsedData);

                displayUserData(parsedData);
            }
            catch(error)
            {
                statsContainer.innerHTML = `<p>${error.message}</p>`;
            }
            finally
            {
                searchButton.textContent = "Search";
                searchButton.disabled = false;
            }

        }

        searchButton.addEventListener('click', function() {
            const username = usernameInput.value;
            console.log(username);

            if(validateUsername(username))
            {
                fetchUserDetails(username);
            }



        })


})