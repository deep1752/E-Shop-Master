import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
    if(!stripePromise) {
        // stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
        stripePromise = loadStripe("pk_test_51R8xF32M64DAWOHVISDcVzoArDdUqeZ3ZeAENXPsR6lDJ2ZgqFiNO0jX5dbd9r2GGKBdZn2y2Vce1G6AIawf95oI00aaR4BiGO");
    }

    return stripePromise;
}

export default getStripe;