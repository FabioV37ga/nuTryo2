// Ambiente (0 = dev local, 1 = produção) 
var ambiente;
if (document.location.toString().includes("onrender")){
    ambiente = 0;
}else{
    ambiente = 1;
}
var frontend:string;
var backend:string;
if (ambiente == 0){
    frontend = 'https://nutryo2-w5pq.onrender.com'
    backend = 'https://nutryo2.onrender.com'
}else{
    frontend = 'http://localhost:3000'
    backend = 'http://localhost:3001'
}
export { frontend }
export { backend }