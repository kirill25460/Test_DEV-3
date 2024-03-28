import './css/styles.css';

const inputText = document.getElementById('inputText');
const applyButton = document.getElementById('applyButton');
const result = document.getElementById('result');
let initialPositionX, initialPositionY;

inputText.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        result.textContent = inputText.value;
    }
});

applyButton.addEventListener('click', () => {
    result.textContent = inputText.value;
});

let isDragging = false;
let startX, startY, endX, endY;
let selectedSpans = [];

result.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    endX = event.clientX;
    endY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        endX = event.clientX;
        endY = event.clientY;
        updateSelection();
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        updateSelection();
    }
});
function isInsideSelection(element) {
    const rect = element.getBoundingClientRect();
    return rect.left >= Math.min(startX, endX) &&
           rect.right <= Math.max(startX, endX) &&
           rect.top >= Math.min(startY, endY) &&
           rect.bottom <= Math.max(startY, endY);
}

function updateSelection() {
    const text = result.textContent;
    result.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        if (isInsideSelection(span)) {
            span.style.color = 'red';
        }
        result.appendChild(span);
    }
}





let draggedLetter = null;
let offsetX = 0;
let offsetY = 0;



document.addEventListener('mousedown', (event) => {
    const target = event.target;
    if (target.nodeName === 'SPAN') {
        draggedLetter = target;
        const rect = draggedLetter.getBoundingClientRect();
        initialPositionX = event.clientX - rect.left;
        initialPositionY = event.clientY - rect.top;
        offsetX = rect.left - event.clientX;
        offsetY = rect.top - event.clientY;
        draggedLetter.style.position = 'absolute';
        draggedLetter.style.zIndex = 1000;
        document.body.appendChild(draggedLetter);
    }
});


document.addEventListener('mousemove', (event) => {
    if (draggedLetter) {
        const newPositionX = event.clientX + offsetX;
        const newPositionY = event.clientY + offsetY;
        let isColliding = false;

        selectedSpans.forEach(span => {
            if (span.classList.contains('selected') && span !== draggedLetter) {
                const rect = span.getBoundingClientRect();
                if (Math.abs(rect.left - newPositionX) < 1) {
                    isColliding = true;
                }
            }
        });

        if (!isColliding) {
            draggedLetter.style.left = newPositionX + 'px';
            draggedLetter.style.top = newPositionY + 'px';
        } else {
            draggedLetter.style.left = (newPositionX + 10) + 'px'; 
            draggedLetter.style.top = newPositionY + 'px';
        }
    }
});



document.addEventListener('mouseup', () => {
    if (draggedLetter) {
        draggedLetter.style.position = 'absolute';
        draggedLetter.style.zIndex = 'auto';
        draggedLetter = null;
    }
});



