//---------------------------Importations block----------------------------------------------//

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SwitchOnOff from '../components/SwitchOnOff';
import ParameterConsole from '../components/ParameterConsole';

//---------------------------socket server conection-------------------------------------------//

const { io } = require("socket.io-client");
const socketServerUrl = 'https://desafio-tecnico-senai-backend.herokuapp.com';
const socket = io(socketServerUrl);

//---------------------------Listener block----------------------------------------------//

const createIdListener = (socket, setDeviceId, params, controls, offMode) => {
  socket.on('createId', ({ id }) => {
    setDeviceId(id);
    socket.emit('newDevice', { id, params, controls, offMode });
  });
};
const switchOnOffListener = (socket, deviceId, switchOffMode) => {
  socket.removeAllListeners('switchOnOff');
  socket.on('switchOnOff', ({ id, offMode: newPosition }) => {
    id === deviceId && switchOffMode(newPosition);
  });
};
const controlDeviceListener = (socket, deviceId, setControls, gain, params, setParameters) => {
  socket.removeAllListeners('controlDevice');
  socket.on('controlDevice', ({ newControls, id }) => {
    if (id === deviceId) {
      setControls(newControls);
      const newParams = {};
      Object.keys(params).forEach((paramName, index) => {
        const controlValue = Object.values(newControls)[index]
        newParams[paramName] = controlValue * gain[index];
      });
      setParameters(newParams);
      socket.emit('updateDashboard', { id: deviceId, params: newParams, controls: newControls });
    }
  });
};



function Device(props) {

  //---------------------------States declarations block------------------------------------------//

  const [controls, setControls] = useState({
    control1: 0,
    control2: 0,
  });
  const [params, setParameters] = useState({
    parameter1: 0,
    parameter2: 0,
  });
  const [offMode, switchOffMode] = useState(false);
  const [deviceId, setDeviceId] = useState();
  const gain = [35.32, 64.47];

  //-------------------------------useEffects block-----------------------------------------------//

  useEffect(() => {
    socket.emit('getId');
  }, []);

  useEffect(() => {
    switchOnOffListener(socket, deviceId, switchOffMode)
    createIdListener(socket, setDeviceId, params, controls, offMode);// eslint-disable-next-line    
  }, []);

  useEffect(() => {
    switchOnOffListener(socket, deviceId, switchOffMode);// eslint-disable-next-line
  }, [offMode]);

  useEffect(() => {
    controlDeviceListener(socket, deviceId, setControls, gain, params, setParameters);// eslint-disable-next-line
  }, [controls, deviceId]);

  const handleSwichOnOff = ({ target: { checked }}) => {
    socket.emit('switchOnOff', { id: deviceId, offMode: !offMode })
    switchOffMode(!checked);
  };

  return (
    <Grid 
      container
      spacing={2}
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ width: '100%', marginTop: '50px'}}
    >
      <Grid 
        item
        xs={5}
        sx={{ width: '100%', maxWidth: 500, backgroundColor: '#f5f5f0', padding: '30px', borderRadius: '10px', border: 'black 1px solid'}}
      >
        <Typography
          sx={{ width: '100%' , textAlign: 'left', marginBottom: '10px'}}
          variant="h5"
          // color="white"
        >
          { `Dispositivo id: ${deviceId}` }
        </Typography> 
        {
          Object.entries(controls).map((control, index) => {
            const [paramName, paramValue] = Object.entries(params)[index]
            const [controlName, controlValue]  =  control;
            const handleSlideControl = ({ target }) => {
              const newControls = { ...controls, [controlName]: target.value }
              setControls(newControls);
              const newParams = { ...params, [paramName]:  gain[index] * target.value }
              setParameters({ ...params, [paramName]:  gain[index] * target.value });
              socket.emit('updateDashboard', { id: deviceId, params: newParams, controls: newControls });
            }
            return (
              < ParameterConsole 
                key={index}
                handleSlideControl={handleSlideControl}
                offMode={offMode}
                paramName={paramName}
                paramValue={paramValue}
                controlValue={controlValue}
              />
            )
          })
        }
        <SwitchOnOff 
          offMode={offMode}
          onChange={handleSwichOnOff}
        /> 
      </Grid>
    </Grid>
  );
}

export default Device;