"use strict";

let facts = [
    "Jacarés tem uma das mordidas mais fortes de todos os seres vivos.",
    "Apesar de terem pernas curtinhas, os jacarés conseguem subir algumas árvores.",
    "Em terra, os jacarés conseguem correr até cerca de 18 km/h.",
    "Jacarés tem entre 75 a 80 dentes, mas durante a sua vida pode perder mais de 2000 dentes.",
    "Os jacarés crescem durante toda a sua vida.",
    "A temperatura a que os ovos se desenvolvem influência o sexo de um jacaré."
]

function swapTab(evt, tabID) {
    let tabs = document.getElementsByClassName("alligator");
    // tablink classname was assigned to divs to color the active tab
    let tablinks = document.getElementsByClassName("tablink");

    Array.from(tabs).forEach(element => {
        element.style.display = "none";
    });
    Array.from(tablinks).forEach(element => {
        element.className = element.className.replace(" w3-pink", "");
    });
    document.getElementById(tabID).style.display = "block";
    evt.target.className += " w3-pink"
}

function getFact() {
    let max = facts.length;
    let min = 0
    let rand = Math.floor(Math.random() * (max - min) + min);
    document.getElementById('fact-modal').style.display = 'block';
    document.getElementById('fact-inner').innerHTML = facts[rand];
}

function closeModal() {
    document.getElementById('fact-modal').style.display = "none";
}