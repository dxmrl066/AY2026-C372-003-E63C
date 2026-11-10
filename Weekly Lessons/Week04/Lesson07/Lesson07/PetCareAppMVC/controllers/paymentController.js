const MockProvider = require('../services/mockPaymentProvider');
const mockServices = require('../data/mockServices');

function preparePayment(req, res) {
  const serviceId = Number(req.params.serviceId);
const service = mockServices.find(
  (item) => String(item.serviceId) === req.params.serviceId
);
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



async function createMockPayment(req, res) {
  const serviceId = Number(req.params.serviceId);

const service = mockServices.find(
  item => item.serviceId === serviceId
);

  if (!service) {
    return res.status(404).json({
      error: 'Service not found'
    });
  }

  const paymentRequest = {
    amount: service.amount,
    currency: 'sgd',
    merchantReference: 'SERVICE-' + service.serviceId,
    description: service.serviceName,
    testStatus: req.body?.testStatus
  };

  // Call mock payment provider
  const providerResult = await MockProvider.createPayment(paymentRequest);

  const bookingStatusByPayment = {
    APPROVED: 'CONFIRMED',
    PENDING: 'AWAITING_PAYMENT',
    DECLINED: 'PAYMENT_FAILED'
  };

  return res.json({
    serviceId: service.serviceId,
    providerPaymentId: providerResult.providerPaymentId,
    merchantReference: providerResult.merchantReference,
    paymentStatus: providerResult.status,
    bookingStatus: bookingStatusByPayment[providerResult.status]
  });
}


 module.exports = {
  preparePayment,
  createMockPayment
};
