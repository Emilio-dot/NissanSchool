import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { show_alerta } from '../../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const Inventory = () => {
  const url ='/Inventory'
  const [inventory, setInventory] = useState({ data: [] });//Tabla inventario mandar a llamar
  const [d_type, setD_type]=useState(''); //DeviceType
  const [modelo, setModelo]=useState(''); //Model Type
  const [num, setNum]=useState(''); //número de serie
  const [purchase, setPurchase]=useState(''); //año en el que se compro
  const [version, setVersion]=useState(''); //Tipo de versionamiento Sistema operativo
  const [location, setLocation]=useState(''); //Dónde se encuentran ubicados
  const [itemId, setItemId] = useState(''); //Y su respectivo ID
  const [title, setTitle]=useState('');
  const [operation, setOperation] = useState(1); // Ejemplo: asignar un valor a 'operation'


  useEffect(() => { 
    getInventory();
  }, []);

  const getInventory = async () => {
    try {
        const respuesta = await axios.get('/Inventory');
        setInventory({ data: respuesta.data }); // Ajustar aquí

    } catch (error) {
        console.error('Error al obtener datos:', error.message);
        // Puedes manejar el error según tus necesidades
    }
};


  const openModal = (op, id, d_type, modelo, num, purchase, version, location) =>{
    console.log('op:', op);
    console.log('id:', id)
    setItemId('');
    setD_type('');
    setModelo('');
    setNum('');
    setPurchase('');
    setVersion('');
    setLocation('');
    if (op === 1){
      setTitle('Registrar Producto');
    } else if (op === 2) {
      setTitle('Editar Producto');
      setItemId(id);
      setD_type(d_type);
      setModelo(modelo);
      setNum(num);
      setPurchase(purchase);
      setVersion(version);
      setLocation(location);
    }
    window.setTimeout(function(){
      document.getElementById('modalInventory').focus(); //nombre
    },500);

  }

  const validar = () => {
    var parametros;
    var metodo;
    if (d_type === '') { 
      show_alerta('Completa el campo "Device Type"', 'warning');
    } else if (modelo === '') {
      show_alerta('Completa el campo "Modelo"', 'warning');
    } else if (num === '') {
      show_alerta('Completa el campo "Número de Serie"', 'warning');
    } else if (purchase === '') {
      show_alerta('Completa el campo "Purchase Year"', 'warning');
    } else if (version === '') {
      show_alerta('Completa el campo "Version"', 'warning');
    } else if (location === '') {
      show_alerta('Completa el campo "Location"', 'warning');
    } else {
      if (operation === 1) {
        parametros = {
          id: itemId,
          d_type: d_type,
          modelo: modelo,
          num: num,
          purchase: purchase,
          version: version,
          location: location,
        };
        metodo = 'POST';
      } else {
        parametros = {
          id: itemId,
          d_type: d_type.trim(),
          modelo: modelo.trim(),
          num: num.trim(),
          purchase: purchase.trim(),
          version: version.trim(),
          location: location.trim(),
        };
        metodo = 'PUT';
      }
      enviarSolicitud(metodo, parametros);
    }
  };
  
  const enviarSolicitud = async (metodo, parametros) => {
    try {
        const respuesta = await axios({
            method: metodo,
            url: '/Inventory', // Usa la URL correcta de tu servidor
            data: parametros
        });
        var tipo = respuesta.data[0];
        var msj = respuesta.data[1];
        show_alerta('Operacion exitosa', 'success');
        if (tipo === '') {
            document.getElementById('btnCerrar').click();
            getInventory();
        }
    } catch (error) {
        show_alerta('Error en la solicitud'+ error.message, 'error');
        console.log(error);
    }
  }

  const deleteProduct = (itemId)=>{ //Se puede poner "title del objeto que se quiere eliminar"
    const MySwal = withReactContent (Swal);
    MySwal.fire({
      title:'Seguro de eliminar este producto ?',
      icon:'question',text:'No se podrá dar marcha atras',
      showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
        setItemId(itemId);
        enviarSolicitud('DELETE', {itemId:id});
      } else{
        show_alerta('El producto NO fue eliminado', 'info')
      }
    });
  }

  return (
    <div className='App'>
      <div className='container-fluid'>
        <div className="row mt-3">
          <div className='col-md-4 offset-4'>
            <div className='d-grid mx-auto'>
              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                <i className='fa-solid fa-circle-plus'></i> Añadir
              </button>
            </div>
          </div>
        </div>
  
        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <div className="table-responsive">
              <table className='table table-bordered'>
                <thead className='th_navbar'>
                  <tr>
                    <th>#</th>
                    <th>Device Type</th>
                    <th>Brand Model</th>
                    <th>Num. Serie</th>
                    <th>Purchase Year</th>
                    <th>Version</th>
                    <th>Location</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {Array.isArray(inventory.data) && inventory.data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.D_type}</td>
                      <td>{item.modelo}</td>
                      <td>{item.num}</td>
                      <td>{item.purchase}</td>
                      <td>{item.version}</td>
                      <td>{item.location}</td>
                      <td>
                      <button onClick={() => openModal(2, item.id, item.d_type, item.modelo, item.num, item.purchase, item.version, item.location)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                        <i className='fa-solid fa-edit'></i>
                      </button>
                        &nbsp;
                        <button onClick={()=> deleteProduct(inventory.itemId, inventory.title)} className='btn btn-danger'>
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <div id='modalInventory' className='modal fade' aria-hidden='true'>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className='h5'>{title} </label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
  
            <div className="modal-body">
              <input type='hidden' id='id'/>
              <div className="input-group mb-3">
                <label htmlFor='type' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <select id='D_type' className='form-select' value={d_type} onChange={(ev) => setD_type(ev.target.value)}>
                  <option value='' disabled>Device Type</option>
                  <option value='1'>Laptop</option>
                  <option value='2'>Desktop</option>
                </select>
              </div>
  
              <div className="input-group mb-3">
                <label htmlFor='modelo' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <select id='modelo' className='form-select' value={modelo} onChange={(ev) => setModelo(ev.target.value)}>
                  <option value='' disabled>Brand</option>
                  <option value='1'>Modelo 1</option>
                  <option value='2'>Modelo 2</option>
                </select>
              </div>
  
              <div className="input-group mb-3">
                <label htmlFor='num' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <input type='text' id='num' className='form-control' placeholder='Número de Serie' value={num} onChange={(ev) => setNum(ev.target.value)} />
              </div>
  
              <div className="input-group mb-3">
                <label htmlFor='purchase' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <select id='purchase' className='form-select' value={purchase} onChange={(ev) => setPurchase(ev.target.value)}>
                  <option value='' disabled>Purchase Year</option>
                  <option value='2021'>2021</option>
                  <option value='2022'>2022</option>
                </select>
              </div>
  
              <div className="input-group mb-3">
                <label htmlFor='version' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <select id='version' className='form-select' value={version} onChange={(ev) => setVersion(ev.target.value)}>
                  <option value='' disabled>Version</option>
                  <option value='1'>Version 1</option>
                  <option value='2'>Version 2</option>
                </select>
              </div>
  
              <div className="input-group mb-3">
                <label htmlFor='location' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <select id='location' className='form-select' value={location} onChange={(ev) => setLocation(ev.target.value)}>
                  <option value='' disabled>Location</option>
                  <option value='1'>Location 1</option>
                  <option value='2'>Location 2</option>
                </select>
              </div>
  
              <div className='d-grid col-6 mx-auto'>
              <button onClick={()=> validar()} className='btn btn-success'>
                <i className='fa-solid fa-floppy-disk'> Guardar</i>
              </button>
              </div>
            </div>
  
            <div className='modal-footer'>
              <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'> Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Inventory;
