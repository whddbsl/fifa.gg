const Authorization =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJYLUFwcC1SYXRlLUxpbWl0IjoiNTAwOjEwIiwiYWNjb3VudF9pZCI6Ijg4OTc5Njk4NiIsImF1dGhfaWQiOiIyIiwiZXhwIjoxNjk4Mzg5NjEzLCJpYXQiOjE2ODI4Mzc2MTMsIm5iZiI6MTY4MjgzNzYxMywic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsInRva2VuX3R5cGUiOiJBY2Nlc3NUb2tlbiJ9.ScIXRE8j8IwHFScO-2uNbBf8cK7dnFiVxxi_dKX6CJk";
let inputNickName = "";
let searchButton = document.getElementById("search-button");
let userInput = document.getElementById("user-input"); // 유저가 입력한 닉네임 가져오기
let matchButton = document.getElementById("match-button")
let resultButton = document.getElementById("result-button")

let data = null; // 전역 변수로 선언
let accessID = null; //
function getUserId() {// 유저 고유 식별자 가져오기
  inputNickName = userInput.value;
  async function getData() {
    let header = new Headers({
      Authorization: Authorization,
    });
    const url = `https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=${inputNickName}`;
    const response = await fetch(url, { headers: header });
    return await response.json(); // Promise를 반환하도록 변경
  }
  getData()
    .then((result) => {
      data = result; // 전역 변수에 결과 저장
      accessID = data.accessId;
      console.log(data);
      console.log(accessID);
      renderUserInfo();
    })
    .catch((error) => {
      console.error(error);
    });
}

searchButton.addEventListener("click", getUserId);

function renderUserInfo() {
  userHTML = ``;
  userHTML += `닉네임 : ${data.nickname}<br>
    레벨 : ${data.level}`;
  document.getElementById("user-board").innerHTML = userHTML;
}

let matchData = []
async function getUserMatch(){//유저 친선경기 매치 목록 불러오기
    let header = new Headers({
        Authorization: Authorization,
    })
    const url = `https://api.nexon.co.kr/fifaonline4/v1.0/users/${accessID}/matches?matchtype=40&offset=0&limit=20`
    const response = await fetch(url, {headers: header});
    matchData = await response.json();
    console.log(matchData)
}


async function getMatchDetail(){
    let header = new Headers({
        Authorization: Authorization,
    })
    for(i=0;i<matchData.length;i++){
        const url =`https://api.nexon.co.kr/fifaonline4/v1.0/matches/${matchData[i]}`
        const response = await fetch(url, {headers: header});
        let data = await response.json()
        let matchDate = data.matchDate
        console.log(matchDate)
        let matchPlayer1 = data.matchInfo[0].nickname
        let matchPlayer2 = data.matchInfo[1].nickname
        let player1Result = data.matchInfo[0].matchDetail.matchResult
        let player2Result = data.matchInfo[1].matchDetail.matchResult
        console.log(matchPlayer1,player1Result,matchPlayer2,player2Result);
        let player1Goal = data.matchInfo[0].shoot.goalTotal
        let player2Goal = data.matchInfo[1].shoot.goalTotal
        console.log(player1Goal,player2Goal)
    }    
}

resultButton.addEventListener("click",getMatchDetail)
matchButton.addEventListener("click",getUserMatch)

