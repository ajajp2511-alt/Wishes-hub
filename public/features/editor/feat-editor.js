// Feature: Live Style Engine
window.openEditor = (id) => {
    // Editor UI dikhane ka logic
    const card = document.getElementById(`card-${id}`);
    const controls = `
        <div class="editor-panel">
            <select onchange="changeFont('${id}', this.value)">
                <option value="'Poppins', sans-serif">Standard</option>
                <option value="'Pacifico', cursive">Cursive</option>
                <option value="'Montserrat', sans-serif">Bold</option>
            </select>
            <input type="color" onchange="changeColor('${id}', this.value)" value="#ffffff">
        </div>
    `;
    card.insertAdjacentHTML('beforeend', controls);
};

window.changeFont = (id, font) => {
    document.getElementById(`text-${id}`).style.fontFamily = font;
};

window.changeColor = (id, color) => {
    document.getElementById(`text-${id}`).style.color = color;
};
