"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/currency";
import { getPaystackConfig } from "@/lib/paystack";
import { NIGERIAN_STATES, getShippingRate, ShippingAddress } from "@/types/order";
import { usePaystackPayment } from "react-paystack";
import { ShoppingBag, Truck, CreditCard, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Id } from "@convex/_generated/dataModel";

type CheckoutStep = "shipping" | "payment" | "confirmation";

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const createOrderMutation = useMutation(api.orders.create);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderReference, setOrderReference] = useState("");
  const [orderError, setOrderError] = useState("");

  const subtotal = getSubtotal();
  const shippingCost = shippingAddress.state ? getShippingRate(shippingAddress.state) : 0;
  const total = subtotal + shippingCost;

  // Update shipping address when user data is available
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push("/");
    }
  }, [items, orderComplete, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const paystackConfig = getPaystackConfig(
    shippingAddress.email,
    total,
    [
      { display_name: "Customer Name", variable_name: "customer_name", value: `${shippingAddress.firstName} ${shippingAddress.lastName}` },
      { display_name: "Phone", variable_name: "phone", value: shippingAddress.phone },
    ]
  );

  const onPaystackSuccess = async (reference: { reference: string }) => {
    setOrderReference(reference.reference);
    setOrderError("");

    try {
      // Save order to Convex database
      const orderId = await createOrderMutation({
        items: items.map((item) => ({
          productId: item.product._id as Id<"products">,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress,
        subtotal,
        shipping: shippingCost,
        total,
        paymentReference: reference.reference,
        userId: user?.id,
        email: shippingAddress.email,
      });

      setOrderComplete(true);
      setCurrentStep("confirmation");
      clearCart();
      console.log("Order created successfully:", orderId);
    } catch (error) {
      // Payment succeeded but order save failed - still show confirmation
      // but log the error for admin review
      console.error("Order save failed:", error);
      setOrderError("Payment successful, but there was an issue saving your order. Please contact support with reference: " + reference.reference);
      setOrderComplete(true);
      setCurrentStep("confirmation");
      clearCart();
    }
  };

  const onPaystackClose = () => {
    setIsProcessing(false);
    console.log("Payment closed");
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handlePayment = () => {
    setIsProcessing(true);
    initializePayment({
      onSuccess: onPaystackSuccess,
      onClose: onPaystackClose,
    });
  };

  if (items.length === 0 && !orderComplete) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === "shipping" || currentStep === "payment" || currentStep === "confirmation" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
              <Truck className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:block">Shipping</span>
          </div>
          <div className={`w-16 h-1 mx-2 ${currentStep === "payment" || currentStep === "confirmation" ? "bg-[var(--accent)]" : "bg-[var(--bg-secondary)]"}`} />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === "payment" || currentStep === "confirmation" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:block">Payment</span>
          </div>
          <div className={`w-16 h-1 mx-2 ${currentStep === "confirmation" ? "bg-[var(--accent)]" : "bg-[var(--bg-secondary)]"}`} />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === "confirmation" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:block">Confirmation</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

                {!isAuthenticated && (
                  <div className="bg-[var(--bg-card)] p-4 rounded-lg mb-6">
                    <p className="text-sm text-[var(--text-secondary)]">
                      Already have an account?{" "}
                      <a href="/account/login" className="text-[var(--accent)] hover:underline">
                        Sign in
                      </a>{" "}
                      for a faster checkout experience.
                    </p>
                  </div>
                )}

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingAddress.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingAddress.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <select
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                      >
                        <option value="">Select State</option>
                        {NIGERIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-primary">
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {currentStep === "payment" && (
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-6">Payment</h2>

                <div className="bg-[var(--bg-card)] p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-2">Shipping To:</h3>
                  <p className="text-[var(--text-secondary)]">
                    {shippingAddress.firstName} {shippingAddress.lastName}<br />
                    {shippingAddress.street}<br />
                    {shippingAddress.city}, {shippingAddress.state}<br />
                    {shippingAddress.phone}
                  </p>
                  <button
                    onClick={() => setCurrentStep("shipping")}
                    className="text-[var(--accent)] text-sm hover:underline mt-2"
                  >
                    Edit Address
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[var(--text-secondary)]">
                    Click the button below to pay securely with Paystack. You can pay with your card, bank transfer, or USSD.
                  </p>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay {formatPrice(total)}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setCurrentStep("shipping")}
                    className="w-full text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Back to Shipping
                  </button>
                </div>
              </div>
            )}

            {currentStep === "confirmation" && orderComplete && (
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                <p className="text-[var(--text-secondary)] mb-4">
                  Thank you for your purchase. Your order has been received and is being processed.
                </p>
                {orderError && (
                  <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-600 dark:text-yellow-400 px-4 py-3 rounded-lg mb-4 text-sm">
                    {orderError}
                  </div>
                )}
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  Order Reference: <span className="font-mono font-medium text-[var(--text-primary)]">{orderReference}</span>
                </p>
                <div className="space-y-3">
                  <a
                    href="/account/orders"
                    className="btn-primary block"
                  >
                    View Order Status
                  </a>
                  <a
                    href="/"
                    className="block text-[var(--accent)] hover:underline"
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {!orderComplete && (
            <div className="lg:col-span-1">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-[var(--bg-card)] rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.image.includes("placeholder") ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        ) : (
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--border-color)] pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Shipping</span>
                    <span>{shippingCost > 0 ? formatPrice(shippingCost) : "Calculated at next step"}</span>
                  </div>
                  <div className="border-t border-[var(--border-color)] pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
