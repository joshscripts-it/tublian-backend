const stripe = require("stripe")(process.env.API_KEY);
const Paystack = require("@paystack/paystack-sdk");

const paystack = new Paystack(process.env.PAYSTACK_KEY);

const payment = (req, res, next) => {
  const { card_name, card_cvv, email, amount, expiry_date } = req.body;

  if (!card_name || !expiry_date || !card_cvv || !email || !amount)
    return res.status(400).json({ msg: "Fill-in all fields", statusCode: 400 });

  const customer = { email };

  //@create new customer record
  stripe.customers
    .create(customer)
    .then((cust) => {
      // console.log(cust);
      if (cust)
        return res.status(200).json({
          msg: "Payment Succeeded",
          statusCode: 200,
          data: {
            id: cust?.id,
            email: cust?.email,
            created_at: cust?.created,
          },
        });
    })
    .catch((err) => {
      return res.status(500).json({ statusCode: 500, msg: err.message });
    });
};

const pay_with_paystack = (req, res, next) => {
  const { email, amount } = req.body;

  console.log("Loaded Paystack Key:", process.env.PAYSTACK_KEY);
  console.log(email, amount);

  paystack.transaction
    .initialize({ email, amount: amount || 2000 })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
};

module.exports = { payment, pay_with_paystack };
