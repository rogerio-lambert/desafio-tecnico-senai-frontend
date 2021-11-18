module.exports = (socket, deviceId, switchOffMode) => {
  socket.removeAllListeners('switchOnOff');
  socket.on('switchOnOff', ({ id, offMode: newPosition }) => {
    id === deviceId && switchOffMode(newPosition);
  });
};