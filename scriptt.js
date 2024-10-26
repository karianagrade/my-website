const scenes = document.querySelectorAll('.scene');
const inputField = document.getElementById('inputField');
const cardsContainer = document.getElementById('cardsContainer');
const scrollContainer = document.getElementById('scrollContainer');
const prompts = ["<감독>", "<감사한 분들>", "<도움을 주신 분들>", "<친구팀>"];
let currentScene = 0;
let currentPromptIndex = 0;
let inputData = [[], [], [], []]; // 각 섹션별 입력 데이터를 저장하는 배열
let directorEntered = false;  // 감독 입력 여부
let skipEnterCount = 0; // 엔터 입력 횟수 저장

// Scene 2에 SKIP 설명 메시지 추가
const skipMessage = document.createElement('p');
skipMessage.id = 'skipMessage';
skipMessage.textContent = "[SKIP] 타이핑을 치지 않고 ENTER를 두번 눌러주세요.";
document.getElementById('scene2').appendChild(skipMessage);

function showScene(sceneIndex) {
    scenes.forEach(scene => scene.style.display = 'none');
    scenes[sceneIndex].style.display = 'flex';
}

function nextPrompt() {
    inputField.value = '';
    const promptText = prompts[currentPromptIndex].replace(/<|>/g, '').trim();
    inputField.placeholder = `${promptText}을 입력하세요.`;
    document.getElementById('prompt').textContent = prompts[currentPromptIndex];
}

// 엔터 키 동작 설정
inputField.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (inputField.value.trim() !== '') {
            if (currentPromptIndex === 0 && directorEntered) return;

            // 카드 생성 및 추가
            let card = document.createElement('div');
            card.className = 'card';
            card.textContent = inputField.value;
            cardsContainer.appendChild(card);
            
            // 각 섹션별 데이터 추가
            inputData[currentPromptIndex].push(inputField.value);
            inputField.value = '';
            skipEnterCount = 0;

            if (currentPromptIndex === 0) {
                directorEntered = true;
                currentPromptIndex++; 
                nextPrompt();
            }
        } else {
            skipEnterCount++;
            if (skipEnterCount >= 2) {
                skipEnterCount = 0;
                currentPromptIndex++;
                if (currentPromptIndex < prompts.length) {
                    nextPrompt();
                } else {
                    showScene(2);
                    displayScrollText();
                }
            }
        }
    }
});

function displayScrollText() {
    const sectionTitles = ["<감독>", "<감사한 분들>", "<도움을 주신 분들>", "<친구팀>"];
    
    sectionTitles.forEach((title, index) => {
        let sectionData = inputData[index];
        if (sectionData.length > 0) {
            let titleLine = document.createElement('div');
            titleLine.className = 'scroll-text';
            titleLine.textContent = title;
            scrollContainer.appendChild(titleLine);
            
            sectionData.forEach(data => {
                let line = document.createElement('div');
                line.className = 'scroll-text';
                line.textContent = data;
                scrollContainer.appendChild(line);
            });
        }
    });

    setTimeout(() => {
        showScene(3);  // 마지막 THE END 화면으로 이동
        setTimeout(resetToScene1, 5000);  // 5초 후 초기 화면으로 돌아감
    }, 10000);  // 스크롤 애니메이션을 10초 동안 표시
}

// 초기 화면으로 돌아가기 위한 함수
function resetToScene1() {
    inputData = [[], [], [], []];
    cardsContainer.innerHTML = '';
    scrollContainer.innerHTML = '';
    currentPromptIndex = 0;     // currentPromptIndex를 0으로 초기화
    directorEntered = false;    // <감독> 입력 여부 초기화
    skipEnterCount = 0;
    
    showScene(0);               // 첫 화면(scene1)으로 이동
    setTimeout(() => {
        showScene(1);           // 4초 후 scene2로 이동하여 입력 시작
        nextPrompt();           // <감독>부터 입력 시작
    }, 4000);
}

showScene(0);
setTimeout(() => showScene(1), 4000);  // 4초 후 Scene1에서 Scene2로 이동





