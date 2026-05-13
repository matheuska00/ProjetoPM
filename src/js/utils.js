export const API_KEY = "AIzaSyBoG1Ae_JV-obfSE7uejxjt0Sml8Pzd87Q"; 

export function processarComandoAgenda(data, titulo, descricao) {
    const lembretes = JSON.parse(localStorage.getItem('lembretes_caretalk')) || [];
    lembretes.push({ titulo, data, descricao });
    localStorage.setItem('lembretes_caretalk', JSON.stringify(lembretes));
}

export function processarComandoPerfil(campo, valor) {
    let perfil = JSON.parse(localStorage.getItem('perfil_caretalk')) || {};
    if (perfil.aiPermissao) {
        if (!perfil.doencas) perfil.doencas = [];
        switch(campo) {
            case 'aniversario':
                perfil.aniversario = valor;
                break;
            case 'tipoSanguineo':
                perfil.tipoSanguineo = valor;
                break;
            case 'doenca':
                if (!perfil.doencas.includes(valor)) {
                    perfil.doencas.push(valor);
                }
                break;
            case 'info':
                perfil.info = valor;
                break;
            default:
                perfil[campo] = valor;
        }
        localStorage.setItem('perfil_caretalk', JSON.stringify(perfil));
    }
}