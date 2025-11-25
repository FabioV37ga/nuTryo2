/**
 * Configuração de conexão com backend
 * 
 * Define URLs do frontend e backend baseado no ambiente:
 * - Produção (Render): URLs do servidor remoto
 * - Desenvolvimento (Local): localhost com portas específicas
 */

// Detecta ambiente baseado na URL atual
var ambiente;
if (document.location.toString().includes("onrender")){
    ambiente = 0; // Produção (Render)
}else{
    ambiente = 1; // Desenvolvimento (Local)
}

var frontend: string;
var backend: string;

// Configuração por ambiente
if (ambiente == 0){
    // URLs de produção no Render
    frontend = 'https://nutryo2-w5pq.onrender.com'
    backend = 'https://nutryo2.onrender.com'
}else{
    // URLs de desenvolvimento local
    frontend = 'http://localhost:3000'
    backend = 'http://localhost:3001'
}

export { frontend }
export { backend }