const petModel = require('../models/petModel');
const serviceModel = require('../models/serviceModel');
const serviceBookingModel = require('../models/serviceBookingModel');

const SUCCESS_MESSAGE = 'Booking created. Payment is pending; no payment has been processed.';
const VALIDATION_MESSAGE = 'Choose a pet, service, and valid booking date.';
const UNAVAILABLE_MESSAGE = 'That pet or service is unavailable for booking.';
const SAVE_ERROR_MESSAGE = 'Unable to create the booking. Please try again.';

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isPositiveInteger(value) {
  return /^\d+$/.test(String(value)) && Number(value) > 0;
}

function isValidBookingDate(value, today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const normalized = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
  return normalized === value && value >= today;
}

function listServices(req, res) {
  const ownerId = req.session.user.id;

  petModel.getPetsByOwner(ownerId, (petError, pets) => {
    if (petError) {
      console.error('Error loading pets:', petError);
      return res.status(500).send('Unable to load pets.');
    }

    serviceModel.getActiveServices((serviceError, services) => {
      if (serviceError) {
        console.error('Error loading services:', serviceError);
        return res.status(500).send('Unable to load services.');
      }

      const requestedPetId = String(req.query.petId || '');
      const selectedPet = pets.find((pet) => String(pet.id) === requestedPetId);
      const selectedPetId = selectedPet ? String(selectedPet.id) : '';

      return res.render('services', {
        pets,
        services,
        selectedPetId,
        today: getToday(),
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const { petId, serviceId, bookingDate } = req.body;
  const ownerId = req.session.user.id;

  if (!isPositiveInteger(petId)
    || !isPositiveInteger(serviceId)
    || !isValidBookingDate(bookingDate, getToday())) {
    req.flash('error', VALIDATION_MESSAGE);
    return res.redirect('/services');
  }

  serviceBookingModel.createPendingBooking(
    ownerId,
    Number(petId),
    Number(serviceId),
    bookingDate,
    (error, booking) => {
      if (error) {
        console.error('Error creating booking:', error);
        req.flash('error', SAVE_ERROR_MESSAGE);
        return res.redirect(`/services?petId=${encodeURIComponent(petId)}`);
      }

      if (!booking) {
        req.flash('error', UNAVAILABLE_MESSAGE);
        return res.redirect('/services');
      }

      req.flash('success', SUCCESS_MESSAGE);
      return res.redirect('/bookings');
    }
  );
}

function listBookings(req, res) {
  const ownerId = req.session.user.id;

  serviceBookingModel.getBookingsByOwner(ownerId, (error, bookings) => {
    if (error) {
      console.error('Error loading booking history:', error);
      return res.status(500).send('Unable to load booking history.');
    }

    return res.render('bookings', {
      bookings,
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = {
  listServices,
  createBooking,
  listBookings
};
