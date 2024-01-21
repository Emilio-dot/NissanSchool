import React, {useEffect, useState} from 'react'
import axios, { HttpStatusCode } from 'axios';
import { show_alerta } from '../../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import '../pages/Products.css'

const Location = () => {
    const [inventory, setInventory] = useState({ data: [] });//Tabla inventario mandar a llamar
    
    const [loc, setLoc] = useState({ data: [] });//ESTE ES NUESTRO OBJETO
    const [location, setLocation]=useState(loc.data.length > 0 ? loc.data[0].Location_id : '');//ESTE ES NUESTRO ESTADO

    const [itemId, setItemId] = useState(''); //ID POR PARTE DEL FRONT
    const [title, setTitle]=useState('');
    const [operation, setOperation] = useState(1); // Ejemplo: asignar un valor a 'operation'
  
  
    //NUESTROS OBJETOS: ESTOS CONTIENEN NUESTROS ARRAYS DE CADA "DROPBOX".
  
    useEffect(() => { //INVENTORY-PRODUCTS
    getInventory();
    }, []);
  
  
    const getInventory = async () => {
        try {
            const respuesta = await axios.get('/LocationTable');
            setInventory({ data: respuesta.data }); // Ajustar aquí
        } catch (error) {
            console.error('Error al obtener datos:', error.message);
            // Puedes manejar el error según tus necesidades
        }
    };
  
    
    const openModal = (op, id, location) =>{
      console.log('op:', op);
      console.log('id:', id)
      console.log("PARAMETROS: ",location);
      setItemId('');
      setLocation('');
      setOperation(op);
      if (op === 1){
        setTitle('Registrar Producto');
      } else if (op === 2) {
        console.log(location);
        setTitle('Editar Producto');
        setItemId(id);
        setLocation(location);
      }
      const modalElement = document.getElementById('modalInventory');
      modalElement.addEventListener('shown.bs.modal', () => {
          document.getElementById('Location').focus();
      });
  
    };
  
  
  
    const validar = () => {   
    var parametros;
      var metodo;
      console.log('Valor de location:', location);
      if (location === '') { 
        show_alerta('Completa el campo "location"', 'warning');
      } else {
        if (operation === 1) {
          parametros = {
            itemId: itemId,
            location: location,
          };
          console.log(parametros)
          metodo = 'POST';
        } else if (operation === 2){
          parametros = {
            itemId: itemId,
            location: location,
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
              url: '/LocationTable',  // Usa la URL correcta de tu servidor 
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
          <h2 className='section__title'>Locations</h2>
        </section>
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
                      <tr key={item.Location_id}>
                        <td>{index + 1}</td>
                        <td>{item.Location_description}</td>
                        <td>
                        <button onClick={() => openModal (2, item.Location_id, item.Location_description)} 
                        className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                          &nbsp;
                          <button onClick={()=> deleteProduct(item.Location_id)} className='btn btn-danger'>
                            <i className='fa-solid fa-trash'></i>
                          </button>
                          &nbsp;
                          <button onClick={()=> deleteProduct(item.Location_id)} className='btn btn-danger'>
                            <i className='fa-solid fa-globe'></i>
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
              Location
                <input type='hidden' id='id'/>
                <div className="input-group mb-3">
                  <label htmlFor='type' className='input-group-text'>
                  <i className='fa-solid fa-floppy-disk'/>
                  </label>
                  <input type='text' id='Location' className='form-control' placeholder='Location' value={location} onChange={(ev) =>setLocation(ev.target.value)} />
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

export default Location;