let hero = document.getElementsByClassName("hero")[0];
let monster = document.getElementsByClassName("monster")[0];
let monsterInfo=document.getElementById("monsterInfo");
const width = window.innerWidth;
let Exposionaudio = new Audio("./resource/explosionSound.mp3");
let gameOver=false;
const monsterArray = [
  "./resource/monster1.gif",
  "./resource/monster2.webp"
];

let score = 0;
let monsterEntered=10;

const PlayBGMusic=()=>{
  let AudioBg = new Audio('./resource/darkBg.mp3');
  AudioBg.autoplay=true;
  AudioBg.loop=true;
}

PlayBGMusic();
const PlayMonsterHurt=()=>{
    let monsterHurt=new Audio('./resource/monsterHurt.mp3');
    monsterHurt.play();
}

const PlayMonsterHit=()=>{
    let monsterHit=new Audio('./resource/MonsterHit.mp3');
    monsterHit.play();
}

const PlayShootSound=()=>{
    let powerShot=new Audio('./resource/laserGun.mp3');
    powerShot.play();
}

const PlaymonsterRoar=()=>{
    let monsterRoar=new Audio('./resource/monsterRoar.mp3');
    monsterRoar.play();
}

const PlaymonsterRoar2=()=>{
    let monsterRoar2=new Audio('./resource/monsterRoar2.mp3');
    monsterRoar2.play();
}

const getRandomMonster=()=>{
    return Math.floor(Math.random() * monsterArray.length);
}

const getCurrentHeroPosition = () => {
  const style = window.getComputedStyle(hero);
  return {
    bottomPosition: parseInt(style.bottom),
    leftPosition: parseInt(style.left),
    topPosition: parseInt(style.top),
    rightPosition: parseInt(style.right),
  };
};
let lastMovementTime=0;
const moveElement = (dx, dy) => {
    const currentTime = Date.now();

    if (currentTime - lastMovementTime < 100) {
      return; 
    }
    lastMovementTime = currentTime;
  let rect = hero.getBoundingClientRect();
  let { bottomPosition, leftPosition, topPosition, rightPosition } =
    getCurrentHeroPosition();
  if (dy > 0 && topPosition <= 100) return;
  if (dy < 0 && bottomPosition <= 100) return;
  if (dx < 0 && leftPosition <= 40) return;
  if (dx > 0 && rightPosition <= 40) return;
  hero.style.bottom = bottomPosition + dy + "px";
  hero.style.left = leftPosition + dx + "px";
};

const movePower = (powerAttack) => {
  let powerTime = setTimeout(() => {
    const speed = 100;
    const powerStyle = window.getComputedStyle(powerAttack);
    if (parseInt(powerStyle.right) <= 100) {
      powerAttack.remove();
      clearTimeout(powerTime);
      return;
    }
    powerAttack.style.left = parseInt(powerStyle.left) + speed + "px";
    movePower(powerAttack);
  }, 100);
};

const doGameOver=()=>{
    let gameOverEle = document.getElementById("over");
    gameOverEle.style.display = "flex";
    let scoreEle = document.getElementById("score");
    scoreEle.innerText = "Score: " + score;
    gameOver = true;
    let replay=document.getElementById("replay");
    replay.addEventListener("click",()=>{
      window.location.reload();
    });
    setTimeout(() => {
      hero.remove();
    }, 1000);
    monsterInfo.remove();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    PlayShootSound();
    let { bottomPosition, leftPosition } = getCurrentHeroPosition();
    let powerAttack = document.createElement("IMG");
    powerAttack.src =
      "./resource/powerAttack.gif";
    powerAttack.setAttribute("width", "80px");
    powerAttack.setAttribute("hight", "80px");
    powerAttack.setAttribute("class", "power");
    powerAttack.style.position = "absolute";
    powerAttack.style.bottom = bottomPosition + 100 + "px";
    powerAttack.style.left = leftPosition + 200 + "px";
    powerAttack.style.transition = "bottom 0.1s ease, left 0.1s ease";
    document.body.appendChild(powerAttack);
    movePower(powerAttack);
  }
});

document.addEventListener("keyup",(e)=>{
    if (e.key === "ArrowUp") {
        moveElement(0, 350);
      } else if (e.key === "ArrowDown") {
        moveElement(0, -350);
      }
})


const areInterSecting = (obj1, obj2) => {
  let rect = obj1.getBoundingClientRect();
  let rect2 = obj2.getBoundingClientRect();
  return !(
    rect.left > rect2.right ||
    rect.right < rect2.left ||
    rect.top > rect2.bottom ||
    rect.bottom < rect2.top
  );
};


const moveMonster = (monsterEle) => {
  setTimeout(() => {
    const speed = 10+(score*2);
    const monsterStyle = window.getComputedStyle(monsterEle);
    if (parseInt(monsterStyle.right) >= width) {
      monsterEle.remove();
      monsterEntered--;
      monsterInfo.innerText= "Monsters Until Game Over: "+ monsterEntered;
    } else {
      monsterEle.classList.remove("no-transition");
      monsterEle.style.right = parseInt(monsterStyle.right) + speed + "px";
    }
    if (monsterEle.parentNode) {
      moveMonster(monsterEle);
    }
  }, 100);
};

const getPowertAttackHit = () => {
  let powers = document.getElementsByClassName("power");
  let monsters = document.getElementsByClassName("monster");
  for (let power of powers) {
    for (let monster of monsters) {
      if (areInterSecting(power, monster)) {
        power.remove();
        let monsterLife=parseInt(monster.dataset.value);
        if(monsterLife>0){
            monsterLife--;
            monster.dataset.value=monsterLife;  
            PlayMonsterHit();
        }if(monsterLife<=0 && !monster.classList.contains("dead")){
           monster.classList.add("dead");
           monster.querySelector('img').src="./resource/monsterExplode.gif";
           score++;
           PlayMonsterHurt();
           setTimeout(()=>{
              monster.remove();
           },100)
           break;
        }
      }
    }
  }
};



const getHeroHitMonster = () => {
  let monsters = document.getElementsByClassName("monster");
  for (let monster of monsters) {
    if (areInterSecting(hero, monster)) {
      let heroImg = document.getElementById("heroImg");
      Exposionaudio.play();
      heroImg.src =
        "./resource/explosionimg.gif";
      monster.style.right = -1000 + "px";
      doGameOver();
    }
  }
};

setInterval(() => {
  getHeroHitMonster();
  getPowertAttackHit();
  if(monsterEntered<=0){
    doGameOver();
  }
}, 100);

setInterval(() => {
  let monsterEle = monster.cloneNode(true);
  monsterEle.style.right = -1000 + "px";
  const idx=getRandomMonster();
  monsterEle.querySelector('img').src = monsterArray[idx];
  if(idx===1){
    monsterEle.style.top="20px";
    PlaymonsterRoar();
  }else PlaymonsterRoar2();
  document.body.appendChild(monsterEle);
  moveMonster(monsterEle);
}, 2000);
