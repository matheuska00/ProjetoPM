import { renderizarLembretes } from './calendar.js';

export function adicionarMensagem(texto, isUser, salvar = true) {
    const chatContainer = document.getElementById('chat-container');
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    div.innerText = texto;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (salvar) {
        const historico = JSON.parse(localStorage.getItem('historico_caretalk')) || [];
        historico.push({ texto, isUser });
        localStorage.setItem('historico_caretalk', JSON.stringify(historico));
        if (!isUser) falarTexto(texto);
    }
}

export function togglePerfil(show) {
    document.getElementById('profile-screen').style.display = show ? 'flex' : 'none';
    document.getElementById('chat-container').style.display = show ? 'none' : 'flex';
    document.querySelector('.input-area').style.display = show ? 'none' : 'flex';
    if (show) document.getElementById('welcome-screen').style.display = 'none';
}

export function toggleCalendario(show) {
    document.getElementById('calendar-screen').style.display = show ? 'flex' : 'none';
    document.getElementById('chat-container').style.display = show ? 'none' : 'flex';
    document.querySelector('.input-area').style.display = show ? 'none' : 'flex';
    if (show) {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('profile-screen').style.display = 'none';
        renderizarLembretes();
    }
}

export function toggleWelcomeScreen(show) {
    document.getElementById('welcome-screen').style.display = show ? 'flex' : 'none';
    if (show) {
        document.getElementById('profile-screen').style.display = 'none';
        document.getElementById('calendar-screen').style.display = 'none';
        document.getElementById('chat-container').style.display = 'none';
        document.querySelector('.input-area').style.display = 'none';
    }
}

export function toggleChat(show) {
    document.getElementById('chat-container').style.display = show ? 'flex' : 'none';
    document.querySelector('.input-area').style.display = show ? 'flex' : 'none';
    if (show) {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('profile-screen').style.display = 'none';
        document.getElementById('calendar-screen').style.display = 'none';
    }
}

export function falarTexto(texto) {
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    fala.rate = 0.9;
    window.speechSynthesis.speak(fala);
}

export function setupSpeechRecognition(enviarCallback) {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        document.getElementById('voice-btn').onclick = () => {
            recognition.start();
            document.getElementById('voice-btn').style.background = "red";
        };
        recognition.onresult = (e) => {
            document.getElementById('voice-btn').style.background = "#2563eb";
            document.getElementById('user-input').value = e.results[0][0].transcript;
            enviarCallback();
        };
        recognition.onerror = (e) => {
            console.error("Speech recognition error:", e.error);
            document.getElementById('voice-btn').style.background = "#2563eb"; // Reset button color on error
        };
    } else {
        document.getElementById('voice-btn').style.display = 'none'; // Hide button if not supported
    }
}