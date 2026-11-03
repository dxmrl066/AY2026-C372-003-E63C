
const MockProvider = require('../services/mockPaymentProvider');
const mockServices = require('../data/mockServices');

// GET - Prepare Payment
function preparePayment(req, res) {
  const serviceId = Number(req.params.serviceId);

  const service = mockServices.find(
    item => String(item.serviceId) === req.params.serviceId
  );

  if (!service) {
    return res.status(404).json({
      error: 'Service not found'
    });
  }

  return res.status(200).json({
    serviceId: service.serviceId,
    serviceName: service.serviceName,
    amount: service.amount,
    currency: 'sgd',
    status: 'READY_FOR_PAYMENT'
  });
}

// POST - Create Mock Payment
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

  // Get trusted price from server-side catalogue
  const paymentRequest = {
    amount: service.amount,
    currency: 'sgd',
    merchantReference: 'SERVICE-' + service.serviceId,
    description: service.serviceName,
    testStatus: req.body?.testStatus
  };

  // Call mock payment provider
  const providerResult = await MockProvider.createPayment(paymentRequest);

  // Map payment status to booking status
  const bookingStatusByPayment = {
    APPROVED: 'CONFIRMED',
    PENDING: 'AWAITING_PAYMENT',
    DECLINED: 'PAYMENT_FAILED'
  };

  const bookingStatus = bookingStatusByPayment[providerResult.status];

  // Debugging: check values in VS Code terminal
  console.log("Provider result:", providerResult);
  console.log("Payment status:", providerResult.status);
  console.log("Booking status:", bookingStatus);
  console.log("Updated Lesson 06 controller is running");

  return res.status(200).json({
    serviceId: service.serviceId,
    providerPaymentId: providerResult.providerPaymentId,
    merchantReference: providerResult.merchantReference,
    paymentStatus: providerResult.status,
    bookingStatus: bookingStatus
  });
}

module.exports = {
  preparePayment,
  createMockPayment
};
