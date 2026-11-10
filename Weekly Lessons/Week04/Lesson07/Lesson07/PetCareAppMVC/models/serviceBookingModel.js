const connection = require('../config/db');

function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  connection.getConnection((connectionError, transactionConnection) => {
    if (connectionError) {
      return callback(connectionError);
    }

    let completed = false;
    const finish = (err, result) => {
      if (completed) return;
      completed = true;
      transactionConnection.release();
      callback(err, result);
    };

    transactionConnection.beginTransaction((beginError) => {
      if (beginError) {
        return finish(beginError);
      }

      const eligibilitySql = `
        SELECT services.price
        FROM pets
        JOIN services ON services.is_active = 1
        WHERE pets.id = ? AND pets.owner_id = ? AND services.id = ?
      `;

      transactionConnection.query(
        eligibilitySql,
        [petId, ownerId, serviceId],
        (eligibilityError, eligibleRows) => {
          if (eligibilityError) {
            return rollback(transactionConnection, finish, eligibilityError);
          }

          if (eligibleRows.length !== 1) {
            return rollback(transactionConnection, finish, null, null);
          }

          const bookingSql = `
            INSERT INTO service_bookings
              (pet_id, service_id, booking_status, booked_price, booking_date)
            VALUES (?, ?, 'pending', ?, ?)
          `;

          transactionConnection.query(
            bookingSql,
            [petId, serviceId, eligibleRows[0].price, bookingDate],
            (bookingError, bookingResult) => {
              if (bookingError) {
                return rollback(transactionConnection, finish, bookingError);
              }

              const paymentSql = `
                INSERT INTO payments
                  (booking_id, amount, payment_status, payment_reference)
                VALUES (?, ?, 'pending', NULL)
              `;

              transactionConnection.query(
                paymentSql,
                [bookingResult.insertId, eligibleRows[0].price],
                (paymentError, paymentResult) => {
                  if (paymentError) {
                    return rollback(transactionConnection, finish, paymentError);
                  }

                  transactionConnection.commit((commitError) => {
                    if (commitError) {
                      return rollback(transactionConnection, finish, commitError);
                    }

                    finish(null, {
                      bookingId: bookingResult.insertId,
                      paymentId: paymentResult.insertId
                    });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
}

function rollback(transactionConnection, finish, originalError, result) {
  transactionConnection.rollback((rollbackError) => {
    if (rollbackError && !originalError) {
      return finish(rollbackError);
    }
    finish(originalError, result);
  });
}

function getBookingsByOwner(ownerId, callback) {
  const sql = `
    SELECT
      service_bookings.id AS booking_id,
      DATE_FORMAT(service_bookings.booking_date, '%Y-%m-%d') AS booking_date,
      pets.name AS pet_name,
      services.name AS service_name,
      service_bookings.booked_price,
      service_bookings.booking_status,
      payments.payment_status,
      payments.payment_reference,
      service_bookings.created_at
    FROM service_bookings
    JOIN pets ON pets.id = service_bookings.pet_id
    JOIN services ON services.id = service_bookings.service_id
    LEFT JOIN payments ON payments.booking_id = service_bookings.id
    WHERE pets.owner_id = ?
    ORDER BY service_bookings.created_at DESC, service_bookings.id DESC
  `;
  connection.query(sql, [ownerId], callback);
}

module.exports = {
  createPendingBooking,
  getBookingsByOwner
};
