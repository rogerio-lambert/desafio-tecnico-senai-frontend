module.exports = (socket, deviceId, setControls, gain, params, setParameters) => {
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