import { API_KEY } from './utils.js';

export async function chamarIA(pergunta) {
    const perfil = JSON.parse(localStorage.getItem('perfil_caretalk')) || { nome: "amigo(a)", info: "", aniversario: "", tipoSanguineo: "", doencas: [], aiPermissao: false };
    const historico = JSON.parse(localStorage.getItem('historico_caretalk')) || [];
    const lembretes = JSON.parse(localStorage.getItem('lembretes_caretalk')) || [];
    
    const agendaTexto = lembretes.map(l => `- ${l.data}: ${l.titulo} (${l.descricao})`).join('\n');

    let perfilContexto = `Usuário: ${perfil.nome}. Info: ${perfil.info}.`;
    if (perfil.aniversario) perfilContexto += ` Aniversário: ${perfil.aniversario}.`;
    if (perfil.tipoSanguineo) perfilContexto += ` Tipo Sanguíneo: ${perfil.tipoSanguineo}.`;
    if (perfil.doencas && perfil.doencas.length > 0) perfilContexto += ` Doenças/Condições: ${perfil.doencas.join(', ')}.`;
    perfilContexto += ` Permissão IA preencher perfil: ${perfil.aiPermissao ? 'Sim' : 'Não'}.`;

    const mensagensContexto = historico.slice(-10).map(msg => ({
        role: msg.isUser ? "user" : "model",
        parts: [{ text: msg.texto }]
    }));

    mensagensContexto.push({
        role: "user",
        parts: [{ text: `[CONTEXTO: ${perfilContexto} AGENDA ATUAL:\n${agendaTexto || "Nenhum compromisso"}. 
        PERSONALIDADE: Você é o CareTalk. Seu tom deve ser educado, respeitoso e levemente formal (tratando o usuário com a devida cortesia), mas sempre mantendo o carinho, a empatia e a amizade. 
        INSTRUÇÃO: Se o usuário pedir para agendar algo, responda confirmando e inclua ao final: [COMANDO_AGENDA: data | titulo | descricao]. ${perfil.aiPermissao ? 'Se relevante e com a permissão ativada, você pode sugerir ou preencher dados do perfil (aniversário, tipo sanguíneo, doenças) com o formato [COMANDO_PERFIL: campo | valor].' : ''}] - Pergunta: ${pergunta}` }]
    });

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: mensagensContexto,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            console.error("API Error:", errorData);
            return "Tive um erro técnico ao contatar a IA. Por favor, verifique sua chave API.";
        }

        const data = await res.json();
        if (data.candidates && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        }
        return "Não consegui gerar uma resposta. Tente novamente.";
    } catch (error) {
        console.error("Fetch Error:", error);
        return "Tive um erro técnico de conexão. Pode repetir?";
    }
}
