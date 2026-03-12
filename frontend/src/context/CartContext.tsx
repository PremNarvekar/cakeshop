"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: any) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        // Load initial cart
        const loadCart = () => {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) setCart(JSON.parse(savedCart));
        };
        
        loadCart();

        // Listen to custom cartUpdate events
        window.addEventListener('cartUpdated', loadCart);
        return () => window.removeEventListener('cartUpdated', loadCart);
    }, []);

    const saveCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const addToCart = (item: any) => {
        const existing = cart.find(c => c._id === item._id);
        if (existing) {
            saveCart(cart.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            saveCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (id: string) => {
        saveCart(cart.filter(item => item._id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        saveCart(cart.map(item => item._id === id ? { ...item, quantity } : item));
    };

    const clearCart = () => {
        saveCart([]);
    };

    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
