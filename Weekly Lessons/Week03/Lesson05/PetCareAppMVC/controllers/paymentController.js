const mockServices = require('../data/mockServices');

function preparePayment(req, res) {
  const serviceId = Number(req.params.serviceId);
  const service = mockServices.find((item) => item.serviceId === serviceId);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  return res.status(200).json({
    serviceId: service.serviceId,
    serviceName: service.serviceName,
    amount: service.amount,
    currency: 'sgd',
    status: 'READY_FOR_PAYMENT'
  });
}

module.exports = { preparePayment };
