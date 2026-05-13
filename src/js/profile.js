export function renderizarDoencas(doencas) {
    const container = document.getElementById('diseases-container');
    container.innerHTML = '';
    if (doencas && doencas.length > 0) {
        doencas.forEach((doenca, index) => {
            const bubble = document.createElement('div');
            bubble.className = 'disease-bubble';
            bubble.innerHTML = `
                <span>${doenca}</span>
                <button class="remove-btn" onclick="removerDoenca(${index})">x</button>
            `;
            container.appendChild(bubble);
        });
    } else {
        container.innerHTML = '<p class="disease-empty">Nenhuma doença ou condição adicionada.</p>';
    }
}

export function adicionarDoenca() {
    const diseaseInput = document.getElementById('disease-input');
    const novaDoenca = diseaseInput.value.trim();
    if (novaDoenca) {
        const perfil = JSON.parse(localStorage.getItem('perfil_caretalk')) || { doencas: [] };
        perfil.doencas.push(novaDoenca);
        localStorage.setItem('perfil_caretalk', JSON.stringify(perfil));
        renderizarDoencas(perfil.doencas);
        diseaseInput.value = '';
    }
}

export function removerDoenca(index) {
    const perfil = JSON.parse(localStorage.getItem('perfil_caretalk')) || { doencas: [] };
    perfil.doencas.splice(index, 1);
    localStorage.setItem('perfil_caretalk', JSON.stringify(perfil));
    renderizarDoencas(perfil.doencas);
}

export function salvarPerfil() {
    const nome = document.getElementById('user-name-input').value || "amigo(a)";
    const info = document.getElementById('user-info-input').value;
    const aniversario = document.getElementById('user-birthday-input').value;
    const tipoSanguineo = document.getElementById('user-blood-type-input').value;
    const aiPermissao = document.getElementById('ai-permission-checkbox').checked;
    const doencas = JSON.parse(localStorage.getItem('perfil_caretalk')).doencas || [];
    localStorage.setItem('perfil_caretalk', JSON.stringify({ nome, info, aniversario, tipoSanguineo, doencas, aiPermissao }));
    window.togglePerfil(false);
    location.reload();
}

export function limparHistorico() {
    if(confirm("Deseja apagar as conversas?")) {
        localStorage.removeItem('historico_caretalk');
        location.reload();
    }
}