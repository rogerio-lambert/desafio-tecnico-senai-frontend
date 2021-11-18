module.exports = (socket, setDeviceId, params, controls, offMode) => {
  socket.on('createId', ({ id }) => {
    setDeviceId(id);
    socket.emit('newDevice', { id, params, controls, offMode });
  });
};