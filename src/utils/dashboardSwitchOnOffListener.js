module.exports = (socket, onlineDevices, setOnlineDevices) => {
  socket.removeAllListeners('switchOnOff');
  socket.on('switchOnOff', ({ id, offMode }) => {
    const onlineDevicesUpdated = { ...onlineDevices };
    onlineDevicesUpdated[id] = { ...onlineDevicesUpdated[id], offMode};
    setOnlineDevices(onlineDevicesUpdated);
  })
};