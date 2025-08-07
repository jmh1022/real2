document.getElementById('loadMeal').addEventListener('click', function () {
  const dateInput = document.getElementById('datePicker').value;

  if (!dateInput) {
    alert("날짜를 선택해주세요.");
    return;
  }

  const formattedDate = dateInput.replace(/-/g, ""); // YYYYMMDD
  const apiUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530079&MLSV_YMD=${formattedDate}`;

  fetch(apiUrl)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const mealInfo = data.getElementsByTagName("DDISH_NM")[0];

      const resultBox = document.getElementById("mealResult");

      if (mealInfo) {
        // 급식정보 문자열을 <br>로 나누기
        let mealText = mealInfo.textContent.replace(/\([0-9.]*\)/g, ""); // ()안의 영양정보 제거
        mealText = mealText.replace(/<br\/>/g, "<br>").split("<br>").join("<br>");

        resultBox.innerHTML = `
          <h3>${dateInput} 급식</h3>
          <p>${mealText}</p>
        `;
      } else {
        resultBox.innerHTML = "<p>해당 날짜의 급식 정보가 없습니다.</p>";
      }
    })
    .catch(err => {
      console.error("API 오류:", err);
      document.getElementById("mealResult").innerHTML = "<p>급식 정보를 불러오는 중 오류가 발생했습니다.</p>";
    });
});
