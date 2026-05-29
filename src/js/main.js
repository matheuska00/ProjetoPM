import { adicionarMensagem, toggleWelcomeScreen, toggleChat, togglePerfil, toggleCalendario, setupSpeechRecognition } from './ui.js';
import { chamarIA } from './ai.js';
import { processarComandoAgenda, processarComandoPerfil } from './utils.js';
import { renderizarDoencas, salvarPerfil, limparHistorico, adicionarDoenca, removerDoenca } from './profile.js';
import { renderizarLembretes, adicionarLembrete, removerLembrete } from './calendar.js';

// Expor funções globalmente para onclick em HTML
window.togglePerfil = togglePerfil;
window.toggleCalendario = toggleCalendario;
window.toggleWelcomeScreen = toggleWelcomeScreen;
window.toggleChat = toggleChat;
window.salvarPerfil = salvarPerfil;
window.limparHistorico = limparHistorico;
window.adicionarDoenca = adicionarDoenca;
window.removerDoenca = removerDoenca;
window.adicionarLembrete = adicionarLembrete;
window.removerLembrete = removerLembrete;

async function enviar() {
    const userInput = document.getElementById('user-input');
    const texto = userInput.value.trim();
    if (!texto) return;
    adicionarMensagem(texto, true);
    userInput.value = "";
    let resposta = await chamarIA(texto);
    
    // Verificar se a IA enviou um comando para a agenda
    if (resposta.includes("[COMANDO_AGENDA:")) {
        const regex = /\[COMANDO_AGENDA:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\]/;
        const match = resposta.match(regex);
        if (match) {
            const [fullMatch, data, titulo, descricao] = match;
            processarComandoAgenda(data, titulo, descricao);
            if (document.getElementById('calendar-screen').style.display === 'flex') {
                renderizarLembretes();
            }
            resposta = resposta.replace(fullMatch, "").trim();
        }
    }

    // Verificar se a IA enviou um comando para o perfil
    if (resposta.includes("[COMANDO_PERFIL:")) {
        const regex = /\[COMANDO_PERFIL:\s*(.*?)\s*\|\s*(.*?)\s*\]/;
        const match = resposta.match(regex);
        if (match) {
            const [fullMatch, campo, valor] = match;
            processarComandoPerfil(campo, valor);
            if (document.getElementById('profile-screen').style.display === 'flex') {
            const perfil = JSON.parse(localStorage.getItem('perfil_oldassist')) || { doencas: [] };
                document.getElementById('user-birthday-input').value = perfil.aniversario || '';
                document.getElementById('user-blood-type-input').value = perfil.tipoSanguineo || '';
                document.getElementById('user-info-input').value = perfil.info || '';
                renderizarDoencas(perfil.doencas || []);
            }
            resposta = resposta.replace(fullMatch, "").trim();
        }
    }

    adicionarMensagem(resposta, false);
}

window.onload = () => {
    const perfil = JSON.parse(localStorage.getItem('perfil_oldassist')) || { nome: "amigo(a)", info: "", aniversario: "", tipoSanguineo: "", doencas: [], aiPermissao: false };
    
    document.getElementById('user-name-input').value = perfil.nome !== "amigo(a)" ? perfil.nome : "";
    document.getElementById('user-info-input').value = perfil.info;
    document.getElementById('user-birthday-input').value = perfil.aniversario;
    document.getElementById('user-blood-type-input').value = perfil.tipoSanguineo;
    document.getElementById('ai-permission-checkbox').checked = perfil.aiPermissao;
    renderizarDoencas(perfil.doencas);

    toggleWelcomeScreen(true);
    toggleChat(false);
    togglePerfil(false);
    toggleCalendario(false);

    setupSpeechRecognition(enviar);
    document.getElementById('send-btn').onclick = enviar;
    document.getElementById('user-input').onkeypress = (e) => { if(e.key === 'Enter') enviar(); };
};