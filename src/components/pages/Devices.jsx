import React, {useEffect, useState} from 'react'
import axios, { HttpStatusCode } from 'axios';
import { show_alerta } from '../../functions';
import withReactContent from 'sweetalert2-react-content';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../pages/Products.css'
import Products from './Products';

const Devices = () => {
  
  const [inventory, setInventory] = useState({ data: [] });//Tabla inventario mandar a llamar

  const [deviceType, setDeviceType] = useState({ data: [] });//NUESTRO OBJETO
  const [d_type, setD_type] = useState(deviceType.data.length > 0 ? deviceType.data[0].D_type_id : ''); //ES NUESTRO ESTADO
  
  const [itemId, setItemId] = useState(''); //ID POR PARTE DEL FRONT
  const [title, setTitle]=useState('');
  const [operation, setOperation] = useState(1); // Ejemplo: asignar un valor a 'operation'


  //NUESTROS OBJETOS: ESTOS CONTIENEN NUESTROS ARRAYS DE CADA "DROPBOX".

  useEffect(() => { //INVENTORY-PRODUCTS
  getInventory();
  }, []);


  const getInventory = async () => {
      try {
          const respuesta = await axios.get('/DeviceTypeTable');
          setInventory({ data: respuesta.data }); // Ajustar aquí
      } catch (error) {
          console.error('Error al obtener datos:', error.message);
          // Puedes manejar el error según tus necesidades
      }
  };

  
  const openModal = (op, id, d_type) =>{
    console.log('op:', op);
    console.log('id:', id)
    console.log("PARAMETROS: ",d_type);
    setItemId('');
    setD_type('');
    setOperation(op);
    if (op === 1){
      setTitle('Registrar Producto');
    } else if (op === 2) {
      console.log(d_type);
      setTitle('Editar Producto');
      setItemId(id);
      setD_type(d_type);
    }
    const modalElement = document.getElementById('modalInventory');
    modalElement.addEventListener('shown.bs.modal', () => {
        document.getElementById('D_type').focus();
    });

  };
  

  console.log("Error",);



  const validar = () => {   
  var parametros;
    var metodo;
    console.log('Valor de d_type:', d_type);
    if (d_type === '') { 
      show_alerta('Completa el campo "Device Type"', 'warning');
    } else {
      if (operation === 1) {
        parametros = {
          itemId: itemId,
          d_type: d_type,
        };
        console.log(parametros)
        metodo = 'POST';
      } else if (operation === 2){
        parametros = {
          itemId: itemId,
          d_type: d_type,
        };
        console.log( "Mis parámetros: ",parametros)
        metodo = 'PUT';
      }
      enviarSolicitud(metodo, parametros);
    }
  };
  const enviarSolicitud = async (metodo, parametros) => {
    try {
      console.log('Datos enviados al servidor: ', metodo)
        const respuesta = await axios({
            method: metodo,
            url: '/DeviceTypeTable',  // Usa la URL correcta de tu servidor 
            data: parametros
        });
        var tipo = respuesta.data[0];
        show_alerta('Operacion exitosa', 'success');
        if (tipo === '') {
            document.getElementById('btnCerrar').click();
        }
        await getInventory();
    } catch (error) {
        show_alerta('Error en la solicitud'+ error.message, 'error');
        console.log(error);
    }
  };


  const deleteProduct = (itemId)=>{ //Se puede poner "title del objeto que se quiere eliminar"
    const MySwal = withReactContent (Swal);
    MySwal.fire({
      title:'Seguro de eliminar este producto ?',
      icon:'question',
      text:'No se podrá dar marcha atras',
      showCancelButton:true,
      confirmButtonText:'Si, eliminar',
      cancelButtonText:'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
        enviarSolicitud(`DELETE`, {itemId:itemId});
      } else{
        show_alerta('El producto NO fue eliminado', 'info')
      }
    });
  };

  const [activeComponent, setActiveComponent] = useState('');

  const handleChange = (component) => {
    setActiveComponent(component);
  };

 
  return (
    
    <div className='App'>


      <div className="Back_Buttom">
      
        <NavLink to="/Products" className='Back_Buttom_Buttom' onClick={() => handleChange('Products')}><i className='fa-solid fa-arrow-left'></i> Go Back</NavLink>
        {activeComponent === 'Products' && <Products />}
      </div> 


      <section>
        <h2 className='section__title'>Devices</h2>
      </section>
      <div className='container-fluid'>
        <div className="row mt-3">
          <div className='col-md-4 offset-4'>
            <div className='d-grid mx-auto'>
              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                <i className='fa-solid fa-circle-plus'></i> Add Device
              </button> 
              
            </div>
          </div>
        </div>
        
        
  
        <div className='row mt-3'>
          <div className='col-12 col-lg-9 offset-0 offset-lg-2'>
            <div className="table-responsive">
              <table className='table table-bordered'>
                <thead className='th_navbar'>
                  <tr>
                    <th>#</th>
                    <th>Device</th>
                    <th>EDIT</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {Array.isArray(inventory.data) && inventory.data.map((item, index) => (
                    <tr key={item.D_type_id}>
                      <td>{index + 1}</td>
                      <td>{item.D_type_description}</td>
                      <td>
                      <button onClick={() => openModal (2, item.D_type_id, item.D_type_description)} 
                      className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                        <i className='fa-solid fa-edit'></i>
                      </button>
                        &nbsp;
                        <button onClick={()=> deleteProduct(item.D_type_id)} className='btn btn-danger'>
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
              Device
              <input type='hidden' id='id'/>
              <div className="input-group mb-3">
                <label htmlFor='type' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <input type='text' id='D_type' className='form-control' placeholder='Device type' value={d_type} onChange={(ev) => setD_type(ev.target.value)} />
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
export default Devices;
