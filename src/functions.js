import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export function show_alerta(mensaje,icon,foco=''){
    onfocus(foco);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title:mensaje,
        icon:icon
    });
}

function onfocus(foco){
    if(foco !== ''){
        document.getElementById(foco).focus();
    } else{
        console.log(`No se encontró ningún elemento con el id '${foco}'`);
    }
}
