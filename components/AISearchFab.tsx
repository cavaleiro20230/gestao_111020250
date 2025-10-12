import React, { useState } from 'react';
import AISearchModal from './AISearchModal';
import { ChatBubbleBottomCenterTextIcon } from './icons';

const AISearchFab: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-teal-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 z-40"
                aria-label="Abrir busca com IA"
            >
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8" />
            </button>
            {isModalOpen && <AISearchModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default AISearchFab;
