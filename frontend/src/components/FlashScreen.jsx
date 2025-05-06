import { useState, useEffect } from 'react'
import { horizontalLogo } from '../assets'
import { motion, AnimatePresence } from 'framer-motion'

const FlashScreen = ({ setShowFlashScreen }) => {
    const [localShow, setLocalShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLocalShow(false);
            setShowFlashScreen(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [setShowFlashScreen]);

    return (
        <AnimatePresence>
            {localShow && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gradient-to-b from-[#fff1f1] to-[#ffe4e4] flex items-center justify-center z-50"
                >
                    <motion.img
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={horizontalLogo}
                        alt="Lex AI"
                        className="w-64"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FlashScreen; 