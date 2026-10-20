const paymens = [ // array of payment objects
    { petName: "Chester", amount: 50, status: "APPROVED" },
    { petName: "Mochi", amount: 60, status: "PENDING" },
    { petName: "Mira", amount: 40, status: "DECLINED" }
];


while (petname = input("Enter pet name (or type 'exit' to quit): ")) {
    if (petname == "Chester") {
        console.log("Pet-care service for chester is confirmed");
    }else if (petname == "Mochi") {
        console.log("Mochi's payment status: PENDING");
    }else{
        console.log("Pet not found");
    }
}


// Difference between = , ==, ===
// = {assign a value to a variable}
// == lenient ignore the type
// === same value and same type 

// foreach = not sure how many items in the array 
// for i = knows the numbers of items in the array