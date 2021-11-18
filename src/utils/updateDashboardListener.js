module.exports = (socket, onlineDevices, setOnlineDevices) => {
  socket.removeAllListeners('updateDashboard');
  socket.on('updateDashboard', ({ id, params, controls }) => {
    const onlineDevicesUpdated = { ...onlineDevices };
    onlineDevicesUpdated[id] = { ...onlineDevicesUpdated[id], params, controls };
    setOnlineDevices(onlineDevicesUpdated);
  })
};