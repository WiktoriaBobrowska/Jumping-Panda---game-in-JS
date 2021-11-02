//let Section

document.addEventListener('DOMContentLoaded', () => {
    let game = document.getElementById("game");
    let panda = document.getElementById("panda");
    let score = document.getElementById("score");
    let level = document.getElementById("level");
    let count = 0;
    let activeSteps = [];
    let interval;
    let jumpingH = 0;
    let inAir = false;
    let on = false;
    let movingLeft = false;
    let movingRight = false;
    let speed = 0.6;
    let nextCount = 20;
    let levelCount = 1;
    let points = 0;
    
    //Panda movement & Controls Section
    
    function moveLeft(){
        let left = parseInt(window.getComputedStyle(panda).getPropertyValue("left"));
            panda.style.left = left - 2 + "px";
        if(left<0){
            panda.style.left = 559 + "px";
        }
    }
    
    function moveRight(){
        let left = parseInt(window.getComputedStyle(panda).getPropertyValue("left"));
        panda.style.left = left + 2 + "px";
        if(left>560){
            panda.style.left = 0 + "px";
        }
    }
    
    function jump() {
        if (inAir) return;
        let top = parseInt(window.getComputedStyle(panda).getPropertyValue("top"));
        let TimerUpId = setInterval( function () {
            inAir = true
            jumpingH += 4;
            panda.style.top = top - jumpingH + "px";
            if (jumpingH > 120){
                clearInterval(TimerUpId);
                let TimerDown = setInterval(function () {
                    jumpingH -= 5;
                    if (jumpingH < 0 ) {
                        clearInterval(TimerDown);
                    }
                  },5)
            }
        }, 5)
    }
    
    document.addEventListener("keydown", e => {
        if(e.key==="ArrowRight" && on==true && movingLeft==false){
            interval = setInterval(moveRight, 1);
            movingRight = true;
        }
        if(e.key==="ArrowLeft" && on==true && movingRight==false){
            interval = setInterval(moveLeft, 1);
            movingLeft = true;
        }
        if(e.key==="ArrowUp" && on==true || e.key===" " && on==true){
            jump();
        }
        if(e.key===" " && on==false){
            movingSteps();
            on=true;
            score.innerHTML="";
        }
    });
    document.addEventListener("keyup", e => {
        clearInterval(interval);
        movingLeft = false;
        movingRight = false;
    });
    
    //Game Ending Section
    
    function end(){
        document.addEventListener("keyup", function(event) {
            if (event.key === ' ') {
                this.location.reload();
                on=true;
            }
        });
    }
    function movingSteps() {
        let Steps = setInterval(function(){
            let pandaTop = parseInt(window.getComputedStyle(panda).getPropertyValue("top"));
            let pandaLeft = parseInt(window.getComputedStyle(panda).getPropertyValue("left"));
            if(pandaTop >= 560){
                clearInterval(Steps);
                on=false;
                if(count-7<0){
                    game.innerHTML=("<div id='score'><h2>Game over</h2></br> Score: " + 0 + "</br>Platforms passed: " + 0 +"</br></br>Press Spacebar to Restart<div>");
                }
                else{
                    game.innerHTML=("<div id='score'><h2>Game over</h2></br>Score: " + ((count-7)+points) + "</br>Platforms passed: " + (count-7) +"</br></br>Press Spacebar to Restart</div>");
                }
                end();
            }
    
    //Platforms movement Section
    
            let StepLast = document.getElementById("Step"+(count-1));
            let HoleLast = document.getElementById("Hole"+(count-1));
            if(count>0){
                var StepLastTop = parseInt(window.getComputedStyle(StepLast).getPropertyValue("top"));
                var HoleLastTop = parseInt(window.getComputedStyle(HoleLast).getPropertyValue("top"));
            }
            if(count==0){
                let Step = document.createElement("div");
                let Hole = document.createElement("div");
                Step.setAttribute("id", "Step"+count);
                Hole.setAttribute("id", "Hole"+count);
                Step.setAttribute("class", "Step");
                Hole.setAttribute("class", "Hole");
                Step.style.top = 340 + "px";
                Hole.style.top = 340 + "px";
                game.appendChild(Hole);
                game.appendChild(Step);
                activeSteps.push(count);
                count++;
            }
            if(StepLastTop>50){
                let Step = document.createElement("div");
                let Hole = document.createElement("div");
                Step.setAttribute("id", "Step"+count);
                Hole.setAttribute("id", "Hole"+count);
                Step.setAttribute("class", "Step");
                Hole.setAttribute("class", "Hole");
                Step.style.top = StepLastTop - 100 + "px";
                Hole.style.top = HoleLastTop - 100 + "px";
                let RandomStep = Math.floor(Math.random() * 420);
                Step.style.left = RandomStep + "px";
                game.appendChild(Hole);
                game.appendChild(Step);
                activeSteps.push(count);
                count++;
            }
            let fall = true;
            for(let i = 0; i < activeSteps.length;i++){
                let active = activeSteps[i];
                let iStep = document.getElementById("Step"+active);
                let iHole = document.getElementById("Hole"+active);
                let iStepTop = parseFloat(window.getComputedStyle(iStep).getPropertyValue("top"));
                let iStepLeft = parseFloat(window.getComputedStyle(iStep).getPropertyValue("left"));
                iStep.style.top = iStepTop + speed + "px";
                iHole.style.top = iStepTop + speed + "px";
                if(iStepTop > 560){
                    activeSteps.shift();
                    iStep.remove();
                    iHole.remove();
                }
                if((count-7)==nextCount){
                    levelCount++
                    if(level>=5){
                        speed+=0.025;
                    }
                    else{
                        speed+=0.1;
                    }
                    nextCount+=20;
                    if(level>5){
                        points+=25
                    }
                    else{
                        points+=5;
                    }
                    level.innerHTML="<h4>LEVEL "+levelCount+" <h4>";
                }
    
    //Panda Falling Section
    
                if(iStepTop-20<pandaTop && iStepTop>pandaTop){
                    fall = true;
                    inAir = true;
                    if(iStepLeft-30<=pandaLeft && iStepLeft+170>=pandaLeft){
                        fall = false;
                        inAir = false;
                    }
                }
            }
            if(fall==true){
                if(pandaTop < 560){
                    panda.style.top = pandaTop + 3.2 + "px";
                }
            }
            else{
                panda.style.top = pandaTop - speed + "px";
            }
        },1);
    }
    });