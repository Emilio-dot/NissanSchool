import React, {useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from '../../functions';

const Inventory = () => {
  const url ='http://api-products.run'
  const [inventory, setInventory] = useState([]); //Tabla inventario mandar a llamar
  const [type, setType]=useState(''); //DeviceType
  const [modelo, setModelo]=useState(''); //Model Type
  const [num, setNum]=useState(''); //número de serie
  const [purchase, setPurchase]=useState(''); //año en el que se compro
  const [version, setVersion]=useState(''); //Tipo de versionamiento Sistema operativo
  const [location, setLocation]=useState(''); //Dónde se encuentran ubicados
  const [id, setId]=useState(''); //Y su respectivo ID
  const [title, setTitle]=useState('');
  const [operation, setOperation] = useState(1); // Ejemplo: asignar un valor a 'operation'


  useEffect(() => { 
    getInventory();
  }, []);

  const getInventory = async () =>{     //Llamar la función getInventory
    const respuesta = await axios.get(url);
    setInventory(respuesta.data)
  }

  const openModal = (op, id, type, modelo, num, purchase, version, location) =>{
    setId('');
    setType('');
    setModelo('');
    setNum('');
    setPurchase('');
    setVersion('');
    setLocation('');
    if (op === 1){
      setTitle('Registrar Producto');
    } else if (op === 2) {
      setTitle('Editar Producto');
      setId(id);
      setType(type);
      setModelo(modelo);
      setNum(num);
      setPurchase(purchase);
      setVersion(version);
      setLocation(location);
    }
    window.setTimeout(function(){
      document.getElementById('modalInventory').focus();
    },500);

  }

  const validar = () => {
    var parametros;
    var metodo;
    if (type.trim() === '' || modelo.trim() === '' || num.trim() === '' || purchase.trim() === '' || version.trim() === '' || location.trim() === '') {
      show_alerta('Completa todos los campos', 'warning');
    } else {
      if (operation === 1) {
        parametros = {
          id: id,
          type: type.trim(),
          modelo: modelo.trim(),
          num: num.trim(),
          purchase: purchase.trim(),
          version: version.trim(),
          location: location.trim(),
        };
        metodo = 'POST';
      } else {
        parametros = {
          id: id,
          type: type.trim(),
          modelo: modelo.trim(),
          num: num.trim(),
          purchase: purchase.trim(),
          version: version.trim(),
          location: location.trim(),
        };
        metodo = 'PUT';
      }
      enviarSolicitud(metodo,parametros);
    }
  }

  const enviarSolicitud = async (metodo, parametros) => {
    await axios ({ method: metodo, url:url, data:parametros}).then(function (respuesta) {
      var tipo = respuesta.data[0];
      var msj = respuesta.data[1];
      show_alerta(msj,tipo);
      if(tipo === 'succes'){
        document.getElementById('btnCerrar').click();
        getInventory();
      }
    })
    .catch(function(error){
      show_alerta('Error en la solicitud','error');
      console.log(error);
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
                  </tr>
                </thead>
                <tbody className='table-gropu-divider'>
                  {inventory.map((inventory, index) => (
                    <tr key={inventory.id}>
                      <td>{index + 1}</td>
                      <td>{inventory.type}</td>
                      <td>{inventory.modelo}</td>
                      <td>{inventory.num}</td>
                      <td>{inventory.purchase}</td>
                      <td>{inventory.version}</td>
                      <td>{inventory.location}</td>
                      <td>
                        <button onClick={() => openModal(2, inventory.id, inventory.type, inventory.modelo, inventory.num, inventory.purchase, inventory.version, inventory.location)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button className='btn btn-danger'>
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
              <input type='hidden' id='id' />
              <div className="mb-3">
                <label htmlFor='type' className='form-label'>
                  Device Type
                </label>
                <select id='type' className='form-select' value={type} onChange={(e) => setType(e.target.value)}>
                  <option value='' disabled>Select Device Type</option>
                  <option value='Laptop'>Laptop</option>
                  <option value='Desktop'>Desktop</option>
                </select>
              </div>
  
              <div className="mb-3">
                <label htmlFor='modelo' className='form-label'>
                  Modelo
                </label>
                <select id='modelo' className='form-select' value={modelo} onChange={(e) => setModelo(e.target.value)}>
                  <option value='' disabled>Select Modelo</option>
                  <option value='Modelo1'>Modelo 1</option>
                  <option value='Modelo2'>Modelo 2</option>
                </select>
              </div>
  
              <div className="mb-3">
                <label htmlFor='num' className='form-label'>
                  Número de Serie
                </label>
                <input type='text' id='num' className='form-control' placeholder='Número de Serie' value={num} onChange={(e) => setNum(e.target.value)} />
              </div>
  
              <div className="mb-3">
                <label htmlFor='purchase' className='form-label'>
                  Purchase Year
                </label>
                <select id='purchase' className='form-select' value={purchase} onChange={(e) => setPurchase(e.target.value)}>
                  <option value='' disabled>Select Purchase Year</option>
                  <option value='2021'>2021</option>
                  <option value='2022'>2022</option>
                </select>
              </div>
  
              <div className="mb-3">
                <label htmlFor='version' className='form-label'>
                  Version
                </label>
                <select id='version' className='form-select' value={version} onChange={(e) => setVersion(e.target.value)}>
                  <option value='' disabled>Select Version</option>
                  <option value='Version1'>Version 1</option>
                  <option value='Version2'>Version 2</option>
                </select>
              </div>
  
              <div className="mb-3">
                <label htmlFor='location' className='form-label'>
                  Location
                </label>
                <select id='location' className='form-select' value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value='' disabled>Select Location</option>
                  <option value='Location1'>Location 1</option>
                  <option value='Location2'>Location 2</option>
                </select>
              </div>
  
              <div className='d-grid col-6 mx-auto'>
              <button onClick={()=> validar()} className='btn btn-success'>
                <i className='fa-solid fa-floppy-disk'> Guardar</i>
              </button>
              </div>
            </div>
  
            <div className='modal-footer'>
              <button type='button' id='btnCerrar' className='btn btn-secondary' data-bd-dismiss='modal'> Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Inventory;
