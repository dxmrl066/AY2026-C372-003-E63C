const paymens = [ // array of payment objects
    { petName: "Chester", amount: 50, status: "APPROVED" },
    { petName: "Mochi", amount: 60, status: "PENDING" },
    { petName: "Mira", amount: 40, status: "DECLINED" }
];


console .log("Mochi's payment status is " + paymens[1].status)

paymens.forEach(function(payment) {
    if(payment.status === "APPROVED") {
        console.log(`Pet-care service for ${payment.petName} confirmed`);
    }else if(payment.status === "PENDING") {
        console.log(`Pet-care service for ${payment.petName} is being processed`);
    }else {
        console.log(`Pet-care service for ${payment.petName} unsuccessful`);
    }
});

// Difference between = , ==, ===
// = {assign a value to a variable}
// == lenient ignore the type
// === same value and same type 

// foreach = not sure how many items in the array 
// for i = knows the numbers of items in the array