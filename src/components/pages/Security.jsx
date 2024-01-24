import React, {useEffect, useState} from 'react'
import axios, { HttpStatusCode } from 'axios';
import { show_alerta } from '../../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import '../pages/Products.css'

const Security = () => {
  const [inventory, setInventory] = useState({ data: [] });//Tabla Govern (GV)
  const [identify, setIdentify] = useState({ data: [] });//Tabla Identify (ID)
  const [protect, setProtect] = useState({ data: [] });//Tabla Protect (PR)
  const [detect, setDetect] = useState({ data: [] });//Tabla DETECT (DE)
  const [responds, setResponds] = useState({ data: [] });//Tabla Responds (RS)
  const [recover, setRecover] = useState({ data: [] });//Tabla Responds (RS)
  const [subCategory, setsubCategory] = useState({ data: [] });//Tabla Responds (RS)
  const [average, setAverage] = useState(''); // Promedio

  const [category, setCategory] = useState(''); //OBJETO CON DATOS 

  const [itemId, setItemId] = useState(''); //ID POR PARTE DEL FRONT
  const [title, setTitle]=useState('');
  const [operation, setOperation] = useState(1); // Ejemplo: asignar un valor a 'operation'


//NUESTROS OBJETOS: ESTOS CONTIENEN NUESTROS ARRAYS DE CADA "DROPBOX".


useEffect(() => { //INVENTORY
  getInventory();
  }, []);


useEffect(() => { //getIdentify
  getIdentify();
  }, []);

useEffect(() => { //getProtect
  getProtect();
  }, []);

useEffect(() => { //getDetect
  getDetect();
  }, []);

useEffect(() => { //getResponds
  getResponds();
  }, []);

useEffect(() => { //getRecover
  getRecover();
  }, []);


useEffect(() => { //subCategory
  getsubCategory();
  }, []);



    
const getInventory = async () => {
    try {
        const respuesta = await axios.get('/GovernGV');
        setInventory({ data: respuesta.data }); // Ajustar aquí
    } catch (error) {
        console.error('Error al obtener datos:', error.message);
        // Puedes manejar el error según tus necesidades
    }
};
const getIdentify = async () => {
  try {
      const respuesta = await axios.get('/IdentifyID');
      setIdentify({ data: respuesta.data }); // Ajustar aquí
  } catch (error) {
      console.error('Error al obtener datos:', error.message);
      // Puedes manejar el error según tus necesidades
  }
};
const getProtect = async () => {
  try {
      const respuesta = await axios.get('/ProtectPR');
      setProtect({ data: respuesta.data }); // Ajustar aquí
  } catch (error) {
      console.error('Error al obtener datos:', error.message);
      // Puedes manejar el error según tus necesidades
  }
};
const getDetect = async () => {
  try {
      const respuesta = await axios.get('/DetectDE');
      setDetect({ data: respuesta.data }); // Ajustar aquí
  } catch (error) {
      console.error('Error al obtener datos:', error.message);
      // Puedes manejar el error según tus necesidades
  }
};
const getResponds= async () => {
  try {
      const respuesta = await axios.get('/RespondsRS');
      setResponds({ data: respuesta.data }); // Ajustar aquí
  } catch (error) {
      console.error('Error al obtener datos:', error.message);
      // Puedes manejar el error según tus necesidades
  }
};
const getRecover= async () => {
  try {
      const respuesta = await axios.get('/RecoverRC');
      setRecover({ data: respuesta.data }); // Ajustar aquí
  } catch (error) {
      console.error('Error al obtener datos:', error.message);
      // Puedes manejar el error según tus necesidades
  }
};

const getsubCategory= async () => {
  try {
      const respuesta = await axios.get('/SubCategory');
      setsubCategory({ data: respuesta.data }); // Ajustar aquí
  } catch (error) {
      console.error('Error al obtener datos:', error.message);
      // Puedes manejar el error según tus necesidades
  }
};


const openModal = (op, id, category) =>{
    console.log('op:', op);
    console.log('id:', id)
   
    setItemId('');
    setCategory('');
    setOperation(op);
    if (op === 1){
      setTitle('Registrar Producto');
    } else if (op === 2) {
      console.log(d_type);
      setTitle('Editar Producto');
      setItemId(id);
      setCategory('');
    }
    const modalElement = document.getElementById('modalInventory');
    modalElement.addEventListener('shown.bs.modal', () => {
        document.getElementById('D_type').focus();
    });

  }


  const validar = () => {
    var parametros;
    var metodo;
    console.log('Valor de d_type:', d_type);
    if (category === '') { 
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
          itemId: itemId,
          
        };
        console.log(parametros)
        metodo = 'POST';
      } else if (operation === 2){
        parametros = {
          itemId: itemId,
          
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
            url: '/Inventory',  // Usa la URL correcta de tu servidor
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
  }


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
  }

  let contador = 0; //  ESTO SIRVE PARA EL MAPEO

  console.log("XDXDXD",average);


 

  return (
    <div className='App'>
      <section>
        <h2 className='section__title'>Inventory</h2>
        <span className='section__subtitle'>NMEX A1</span>
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
      </div>

      <div className='row mt-3'>
            <div className='col-12 col-lg-9 offset-0 offset-lg-2'>
              <div className="table-responsive">
                    <table className='table table-bordered'>
                      <thead className='th_navbar'>
                        <tr>
                          <th>Function</th>
                          <th>Category</th>
                          <th>Category identifier</th>
                          <th>Calificacion</th>
                          <th>Promedio</th>
                        </tr>
                      </thead>
                      <tbody className='table-group-divider'>
                        {inventory.data.map((item) => {
                          let imprimirCampo1 = false;
                          let imprimirPromedio = false;
                          if (contador % 6 === 0) {
                            imprimirCampo1 = true;
                            imprimirPromedio = true;
                          }
                          contador++;
                          return (
                            <tr key={item.Inventory_id}>
                              {imprimirCampo1 ? <td rowSpan={6}>{item.Function_description}</td> : null}
                              <td>{item.Category_name}<button onClick={() => openModal(1)} className='btn' data-bs-toggle='modal' data-bs-target='#modalSubcategory'>
                                    <i className='fa-solid fa-circle-plus'></i> 
                                  </button>
                              </td>
                              <td>{item.CategoryIdentifier_name}</td>
                              <td>0.8</td>
                              {imprimirPromedio ?<td rowSpan={6}>0.45</td>: null}
                            </tr>
                          )
                        })}
                        {identify.data.map((item) => {
                          let imprimirCampo1 = false;
                          let imprimirPromedio = false;
                          if (contador % 6 === 0) {
                            imprimirCampo1 = true;
                            imprimirPromedio = true;
                          }
                          contador++;
                          return (
                            <tr key={item.Identify_id}>
                              {imprimirCampo1 ? <td rowSpan={3}>{item.Function_description}</td> : null}
                              <td>{item.Category_name}</td>
                              <td>{item.CategoryIdentifier_name}</td>
                              <td>0.8</td>
                              {imprimirPromedio ? <td rowSpan={3}>0.45</td> : null}
                            </tr>
                          )
                        })}
                        {protect.data.map((item) => {
                          let imprimirCampo1 = false;
                          let imprimirPromedio = false;
                          if (contador % 9 === 0) {
                            imprimirCampo1 = true;
                            imprimirPromedio = true;
                          }
                          contador++;
                          return (
                            <tr key={item.Identify_id}>
                              {imprimirCampo1 ? <td rowSpan={5}>{item.Function_description}</td> : null}
                              <td>{item.Category_name}</td>
                              <td>{item.CategoryIdentifier_name}</td>
                              <td>0.8</td>
                              {imprimirPromedio ? <td rowSpan={5}>0.45</td> : null}
                            </tr>
                          )
                        })}
                        {detect.data.map((item) => {
                          let imprimirCampo1 = false;
                          let imprimirPromedio = false;
                          if (contador % 7 === 0) {
                            imprimirCampo1 = true;
                            imprimirPromedio = true;
                          }
                          contador++;
                          return (
                            <tr key={item.Identify_id}>
                              {imprimirCampo1 ? <td rowSpan={2}>{item.Function_description}</td> : null}
                              <td>{item.Category_name}</td>
                              <td>{item.CategoryIdentifier_name}</td>
                              <td>0.8</td>
                              {imprimirPromedio ? <td rowSpan={2}>0.45</td> : null}
                            </tr>
                          )
                        })}
                        {responds.data.map((item) => {
                          let imprimirCampo1 = false;
                          let imprimirPromedio = false;
                          if (contador % 8 === 0) {
                            imprimirCampo1 = true;
                            imprimirPromedio = true;
                          }
                          contador++;
                          return (
                            <tr key={item.Identify_id}>
                              {imprimirCampo1 ? <td rowSpan={4}>{item.Function_description}</td> : null}
                              <td>{item.Category_name}</td>
                              <td>{item.CategoryIdentifier_name}</td>
                              <td>0.8</td>
                              {imprimirPromedio ? <td rowSpan={4}>0.45</td> : null}
                            </tr>
                          )
                        })}
                        {recover.data.map((item) => {
                          let imprimirCampo1 = false;
                          let imprimirPromedio = false;
                          if (contador % 5 === 0) {
                            imprimirCampo1 = true;
                            imprimirPromedio = true;
                          }
                          contador++;
                          return (
                            <tr key={item.Identify_id}>
                              {imprimirCampo1 ? <td rowSpan={2}>{item.Function_description}</td> : null}
                              <td>{item.Category_name}</td>
                              <td>{item.CategoryIdentifier_name}</td>
                              <td>0.8</td>
                              {imprimirPromedio ? <td rowSpan={2}>0.45</td> : null}
                            </tr>
                          )
                        })}
                        
                      </tbody>
                    </table>
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
                <input type='text' id='category' className='form-control' placeholder='category' value={category} onChange={(ev) => setCategory(ev.target.value)} />
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
    
      <div id='modalSubcategory' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          
        </div>
        <div className="modal-content">
          <div className="modal-bordered">
            <div className="modal-header">
            <label className='h5'>{category} </label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
          </div>
            
            <table className='table table-bordered'>
                      <thead className='th_navbar'>
                        <tr>
                          <th>Category</th>
                          <th>Subcategory</th>
                          <th>Carga de archivos</th>
                          <th>Ok/NG</th>
                          <th>Comentarios</th>
                        </tr>
                      </thead>
                      <tbody className='table-group-divider'>
                        {subCategory.data.map((item) => {
                          let imprimirCampo1 = false;
                          if (contador % 11 === 0) {
                            imprimirCampo1 = true;
                          }
                          contador++;
                          return (
                            <tr key={item.Inventory_id}>
                              {imprimirCampo1 ? <td rowSpan={5}>{item.Category_description}</td> : null}
                              <td>{item.SubCategory_description}</td>
                              <td><input type="file" /></td>
                              <td className='small'>
                                <select id='average' className='form-select' value={average} onChange={(ev) => setAverage(ev.target.value)}>
                                  <option value="pending">pending...</option>
                                  <option value="1">Ok</option>
                                  <option value="0">Ng</option>
                                </select> 
                              </td>
                              <td><textarea name="" id="" cols="10" rows="2">{item.Comment}</textarea></td>
                            </tr>
                          )
                        })}
                          <div className="contenedor">
                            <button type='button' className='btn'> SUBMIT</button>
                          </div>
                      </tbody>
                    </table>
                  </div>
      </div>
    </div>
  );
}
export default Security;
