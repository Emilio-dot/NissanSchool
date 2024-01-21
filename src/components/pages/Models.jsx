import React, {useEffect, useState} from 'react'
import axios, { HttpStatusCode } from 'axios';
import { show_alerta } from '../../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import '../pages/Products.css'

const Models = () => {
    const [inventory, setInventory] = useState({ data: [] });//Tabla inventario mandar a llamar
    
    const [mod, setMod]=useState({ data: [] }); //ESTE ES NUESTRO OBJETO
    const [modelo, setModelo]=useState(mod.data.length > 0 ? mod.data[0].Location_id : ''); //ESTE ES NUESTRO ESTADO
    const [modelo_description, setModelo_description] =useState(mod.data.length > 0 ? mod.data[0].Model_id : ''); //ESTE ES NUESTRO ESTADO

    const [deviceType, setDeviceType] = useState({ data: [] });//NUESTRO OBJETO
    const [d_type, setD_type] = useState(deviceType.data.length > 0 ? deviceType.data[0].D_type_id : ''); //ES NUESTRO ESTADO

    const [itemId, setItemId] = useState(''); //ID POR PARTE DEL FRONT
    const [title, setTitle]=useState('');
    const [operation, setOperation] = useState(1); // Ejemplo: asignar un valor a 'operation'
  
  
    //NUESTROS OBJETOS: ESTOS CONTIENEN NUESTROS ARRAYS DE CADA "DROPBOX".

    useEffect(() => { //DEVICE TYPE
      getDeviceType();
    }, []);

    
  
    useEffect(() => { //INVENTORY-PRODUCTS
    getInventory();
    }, []);
  
  
    const getInventory = async () => {
        try {
            const respuesta = await axios.get('/ModelsTable');
            setInventory({ data: respuesta.data }); // Ajustar aquí
        } catch (error) {
            console.error('Error al obtener datos:', error.message);
            // Puedes manejar el error según tus necesidades
        }
    };


    const getDeviceType = async () => {
      try {
          const respuesta = await axios.get('/DeviceType');
          
          setDeviceType({ data: respuesta.data }); // Ajustar aquí
  
      } catch (error) {
          console.error('Error al obtener datos:', error.message);
          // Puedes manejar el error según tus necesidades
      }
  };
  
    
    const openModal = (op, id, modelo, d_type) =>{
      console.log('op:', op);
      console.log('id:', id)
      console.log("PARAMETROS: ",modelo, d_type);
      setItemId('');
      setModelo('');
      setOperation(op);
      if (op === 1){
        setTitle('Registrar Producto');
      } else if (op === 2) {
        console.log(modelo);
        setTitle('Editar Producto');
        setItemId(id);
        setModelo(modelo);
      }
      const modalElement = document.getElementById('modalInventory');
      modalElement.addEventListener('shown.bs.modal', () => {
          document.getElementById('Modelo').focus();
      });
  
    };

    
  
  
    const validar = () => {   
    var parametros;
      var metodo;
      if (modelo === '') { 
        show_alerta('Completa el campo "modelo"', 'warning');
      } else {
        if (operation === 1) {
          parametros = {
            itemId: itemId,
            modelo: modelo,
          };
          console.log(parametros)
          metodo = 'POST';
        } else if (operation === 2){
          parametros = {
            itemId: itemId,
            modelo: modelo,
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
              url: '/ModelsTable',  // Usa la URL correcta de tu servidor 
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
//ESTOS SUBMITS SON PARA EL BOTON DE CATEGORIAS// THIS SUBMITS ARE FOR THE BUTTOM CATEGORIES//
const categories = (op, id, modelo, d_type, modelo_description) =>{
  if (op === 2) {
    console.log(modelo);
    setTitle('CATEGORIES');
    setItemId(id);
    setD_type(d_type);
    setModelo(modelo);
    setModelo_description(modelo_description);
  }
  const modalElement = document.getElementById('modalInventory');
  modalElement.addEventListener('shown.bs.modal', () => {
      document.getElementById('Modelo').focus();
  });

};

    const Submit = () => {   
      var parametros;
        var metodo;
        console.log('Valor de modelo:', modelo, d_type);
        if (modelo === '') { 
          show_alerta('Completa el campo "modelo"', 'warning');
        } else {
          if (operation === 1) {
            parametros = {
              itemId: itemId,
              modelo: modelo,
              d_type:d_type,
            };
            console.log(parametros)
            metodo = 'POST';
          } else if (operation === 2){
            parametros = {
              itemId: itemId,
              modelo: modelo,
              d_type:d_type,
            };
            console.log( "Mis parámetros: ",parametros)
            metodo = 'PUT';
          }
          enviarSubmit(metodo, parametros);
        }
      };
     
      const enviarSubmit = async (metodo, parametros) => {
        try {
          console.log('Datos enviados al servidor: ', metodo)
            const respuesta = await axios({
                method: metodo,
                url: '/CategoriesModel',  // Usa la URL correcta de tu servidor 
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
//ESTOS SUBMITS SON PARA EL BOTON DE CATEGORIAS// THIS SUBMITS ARE FOR THE BUTTOM CATEGORIES\\  
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
          <span className='section__subtitle'>Models</span>
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
                      <tr key={item.Model_id}>
                        <td>{index + 1}</td>
                        <td>{item.Model_description}</td>
                        <td>
                        <button onClick={() => openModal (2, item.Model_id, item.Model_description)}
                        className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                          &nbsp;
                          <button onClick={()=> deleteProduct(item.Model_id)} className='btn btn-danger'>
                            <i className='fa-solid fa-trash'></i>
                          </button>
                          &nbsp;
                          <button onClick={() => categories (2, item.Model_id, item.Model_id, item.D_type_id, item.Model_description)}
                        className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalCategories'>
                          <i className='fa-solid fa-bars'></i>
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
              Modelo
                <input type='hidden' id='id'/>
                <div className="input-group mb-3">
                  <label htmlFor='type' className='input-group-text'>
                  <i className='fa-solid fa-floppy-disk'/>
                  </label>
                  <input type='text' id='Modelo' className='form-control' placeholder='Modelo' value={modelo} onChange={(ev) =>setModelo(ev.target.value)} />
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
        <div id='modalCategories' className='modal fade' aria-hidden='true'>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <label className='h5'>{title} </label>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
              </div>
              <div className="modal-body">
                A qué categoria pertenece <b>{modelo_description}</b> ? 
                <div className="input-group mb-3">
                  <label htmlFor='type' className='input-group-text'>
                    <i className='fa-solid fa-floppy-disk'/>
                  </label>
                  
                  <select id='D_type' className='form-select' value={d_type} onChange={(ev) => setD_type(ev.target.value)}>
                  <option value='' disabled>Device</option>
                    {deviceType.data.map((item) =>(
                      <option key={item.D_type_id} value={item.D_type_id}>
                      {item.D_type_description}
                    </option>
                    ))}
                  </select>
                </div> 
                <div className='d-grid col-6 mx-auto'>
                <button onClick={()=> Submit()} className='btn btn-success'>
                  <i className='fa-solid fa-floppy-disk'> SUBMIT</i>
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

export default Models;