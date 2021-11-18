module.exports = (socket, setOnlineDevices) => {
  socket.removeAllListeners('loadDevices');
  socket.on('loadDevices', ({ devices }) => {
    setOnlineDevices(devices);
  })
};