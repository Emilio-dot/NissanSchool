import React, {useEffect, useState} from 'react'
import axios, { HttpStatusCode } from 'axios';
import { show_alerta } from '../../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';


const Inventory = () => {
  const url ='/Inventory'
  const [inventory, setInventory] = useState({ data: [] });//Tabla inventario mandar a llamar
  

  const [deviceType, setDeviceType] = useState({ data: [] });//NUESTRO OBJETO
  const [d_type, setD_type] = useState(deviceType.data.length > 0 ? deviceType.data[0].D_type_id : ''); //ES NUESTRO ESTADO

  const [loc, setLoc] = useState({ data: [] });//ESTE ES NUESTRO OBJETO
  const [location, setLocation]=useState(loc.data.length > 0 ? loc.data[0].Location_id : '');//ESTE ES NUESTRO ESTADO
  
 
  const [mod, setMod]=useState({ data: [] }); //ESTE ES NUESTRO OBJETO
  const [modelo, setModelo]=useState(mod.data.length > 0 ? mod.data[0].Location_id : ''); //ESTE ES NUESTRO ESTADO
  

  const [num, setNum]=useState(''); //número de serie
  const [purchase, setPurchase]=useState(''); //año en el que se compro


  const [ver, setVer]=useState({ data: [] });  //ESTE ES NUESTRO OBJETO
  const [version, setVersion]=useState(ver.data.length > 0 ? ver.data[0].Version_id : ''); //ESTE ES NUESTRO ESTADO
  


  const [itemId, setItemId] = useState(''); //ID POR PARTE DEL FRONT
  const [title, setTitle]=useState('');
  const [operation, setOperation] = useState(1); // Ejemplo: asignar un valor a 'operation'


//NUESTROS OBJETOS: ESTOS CONTIENEN NUESTROS ARRAYS DE CADA "DROPBOX".



  useEffect(() =>{ //LOC-LOCATION
    getLoc();
  }, []);

  useEffect(() => { //DEVICE TYPE
    getDeviceType();
  }, []);

  useEffect(() => { //MOD-MODELO
    getMod();
  }, [d_type]);

  useEffect(() => { //VER-VERSION
    getVer();
  }, [d_type]);



const getVer = async () => {
    try {
        const respuesta = await axios.get(`/Version/${d_type}`);
        //const respuesta = await axios.get("/VersionBasic");
        setVer({ data: respuesta.data }); // Ajustar aquí
    } catch (error) {
        console.error('Error al obtener datos:', error.message);
        // Puedes manejar el error según tus necesidades
    }
};
const getLoc = async () => {
    try {
        const respuesta = await axios.get('/Location');
        setLoc({ data: respuesta.data }); // Ajustar aquí
    } catch (error) {
        console.error(error);
        console.error('Error al obtener datos:', error.message);
        // Puedes manejar el error según tus necesidades
    }
};
const getMod = async () => {
  try {
      const respuesta = await axios.get(`/Model/${d_type}`);
      //const respuesta = await axios.get("/ModelBasic");
      setMod({ data: respuesta.data }); // Ajustar aquí
  } catch (error) {
      console.error(error);
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

useEffect(() => { //INVENTORY
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
    console.log("PARAMETROS: ",d_type, modelo, num, purchase, version, location);
    setItemId('');
    setD_type('');
    setModelo('');
    setNum('');
    setPurchase('');
    setVersion('');
    setLocation('');
    setOperation(op);
    if (op === 1){
      setTitle('Registrar Producto');
    } else if (op === 2) {
      console.log(d_type);
      setTitle('Editar Producto');
      setItemId(id);
      setD_type(d_type);
      setModelo(modelo);
      setNum(num);
      setPurchase(purchase);
      setVersion(version);
      setLocation(location);
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
          itemId: itemId,
          d_type: d_type,
          modelo: modelo,
          num: num,
          purchase: purchase,
          version: version,
          location: location,
        };
        console.log(parametros)
        metodo = 'POST';
      } else if (operation === 2){
        parametros = {
          itemId: itemId,
          d_type: d_type,
          modelo: modelo,
          num: num,
          purchase: purchase,
          version: version,
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
  
        <div className='row mt-3'>
          <div className='col-12 col-lg-9 offset-0 offset-lg-2'>
            <div className="table-responsive">
              <table className='table table-bordered'>
                <thead className='th_navbar'>
                  <tr>
                    <th>#</th>
                    <th>Device Type</th>
                    <th>Modelo</th>
                    <th>Version</th>
                    <th>Location</th>
                    <th>Serial No.</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className='table-group-divider XD'>
                  {inventory.data.map((item, index) => (
                    <tr key={item.Inventory_id}>
                      <td>{index + 1}</td>
                      <td>{item.DeviceType}</td>
                      <td>{item.Model}</td>
                      <td>{item.Version}</td>
                      <td>{item.Location}</td>
                      <td>{item.SerialNo}</td>
                      <td>{item.PurchaseDate}</td>
                      <td>
                      <button onClick={() => openModal (2, item.Inventory_id, item.D_type_id, item.Model_id, item.SerialNo, item.PurchaseDate, item.Version_id, item.Location_id)} 
                      className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                        <i className='fa-solid fa-edit'></i>
                      </button>
                        &nbsp;
                        <button onClick={()=> deleteProduct(item.Inventory_id)} className='btn btn-danger'>
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
                  <select id='D_type' className='form-select' value={d_type} onChange={(ev) => setD_type(ev.target.value)}>
                  <option value='' disabled>Device</option>
                    {deviceType.data.map((item) =>(
                      <option key={item.D_type_id} value={item.D_type_id}>
                      {item.D_type_description}
                    </option>
                    ))}
                  </select>
              </div>
              No. Serie
              <div className="input-group mb-3">
                
                <label htmlFor='num' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                
                <input type='text' id='num' className='form-control' placeholder='Número de Serie' value={num} onChange={(ev) => setNum(ev.target.value)} />
              </div>
              Calendar
              <div className="input-group mb-3">
                <label htmlFor='purchase' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <input type="date" id='purchase' className='form-select' value={purchase} onChange={(ev) => setPurchase(ev.target.value)} />
              </div>
              Location
              <div className="input-group mb-3">
                <label htmlFor='location' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <select id='location' className='form-select' value={location} onChange={(ev) => setLocation(ev.target.value)}>
                <option value='' disabled>Location</option>
                  {loc.data.map((item) =>(
                    <option key={item.Location_id} value={item.Location_id}>
                      {item.Location_description}
                    </option>
                  ))}
                </select>
              </div>
              Version
              <div className="input-group mb-3">
                <label htmlFor='version' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <select id='version' className='form-select' value={version} onChange={(ev) => setVersion(ev.target.value)}>
                  <option value='' disabled>Version</option>
                  {ver.data.map((item) =>(
                    <option key={item.Version_id} value={item.Version_id} >
                      {item.Version_description}
                    </option>
                  ))}
                </select>
              </div>
              Model
              <div className="input-group mb-3">
                <label htmlFor='modelo' className='input-group-text'>
                <i className='fa-solid fa-floppy-disk'/>
                </label>
                <select id='modelo' className='form-select' value={modelo} onChange={(ev) => setModelo(ev.target.value)}>
                <option value='' disabled>Model</option>
                {mod.data.map((item) =>(
                    <option key={item.Model_id} value={item.Model_id} >
                      {item.Model_description}
                    </option>
                  ))}
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
