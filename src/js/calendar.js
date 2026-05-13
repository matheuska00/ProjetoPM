export function renderizarLembretes() {
    const list = document.getElementById('reminders-list');
    const lembretes = JSON.parse(localStorage.getItem('lembretes_caretalk')) || [];
    list.innerHTML = lembretes.length ? '' : '<p>Nenhum compromisso marcado.</p>';
    lembretes.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'reminder-item';
        div.innerHTML = `
            <div>
                <strong>${item.data}: ${item.titulo}</strong>
                <br><small>${item.descricao}</small>
            </div>
            <button onclick="removerLembrete(${index})" style="background:none; border:none; color:red; cursor:pointer;">❌</button>
        `;
        list.appendChild(div);
    });
}

export function adicionarLembrete() {
    const titulo = prompt("O que você precisa lembrar?");
    const data = prompt("Para qual dia? (Ex: 15/05)");
    const descricao = prompt("Algum detalhe extra?");
    
    if(titulo && data) {
        const lembretes = JSON.parse(localStorage.getItem('lembretes_caretalk')) || [];
        lembretes.push({ titulo, data, descricao });
        localStorage.setItem('lembretes_caretalk', JSON.stringify(lembretes));
        renderizarLembretes();
    }
}

export function removerLembrete(index) {
    const lembretes = JSON.parse(localStorage.getItem('lembretes_caretalk')) || [];
    lembretes.splice(index, 1);
    localStorage.setItem('lembretes_caretalk', JSON.stringify(lembretes));
    renderizarLembretes();
}